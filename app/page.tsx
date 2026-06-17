"use client";

import { MotionConfig } from "motion/react";
import { useEffect, useState } from "react";
import { categories, CategoryKey, cities, directory } from "@/data/city-directory";
import {
  buildCategoryMatrix,
  buildGeneratedResults,
  cityAliases,
  cityImageUrl,
  cityVisuals,
  cleanCityCandidate,
  detectCategoryFromText,
  detectCityFromMessage,
  categoryKeywords,
  locationDataKey,
  locationPromptKey,
  NearbyCard,
  UserLocation
} from "@/lib/city-intel";
import { mapDirectionsUrl, mapSearchUrl } from "@/lib/maps";
import { trackActivity } from "@/lib/tracking";
import AiTeaser from "@/app/components/AiTeaser";
import DirectoryExplorer from "@/app/components/DirectoryExplorer";
import Hero from "@/app/components/Hero";
import LocationPrompt from "@/app/components/LocationPrompt";
import WelcomeIntro from "@/app/components/WelcomeIntro";
import NearbyPanel from "@/app/components/NearbyPanel";
import SiteFooter from "@/app/components/SiteFooter";
import SiteHeader from "@/app/components/SiteHeader";
import { AboutSection, CoverageSection } from "@/app/components/MarketingSections";

export default function Home() {
  const [city, setCity] = useState<string>("Delhi");
  const [category, setCategory] = useState<CategoryKey>("markets");
  const [userLocation, setUserLocation] = useState<UserLocation | null>(null);
  const [showLocationPrompt, setShowLocationPrompt] = useState(false);
  const [locationStatus, setLocationStatus] = useState("Use nearby location for smarter map routes.");
  const [categoryFrameIndex, setCategoryFrameIndex] = useState(0);
  const [nearbyFrameIndex, setNearbyFrameIndex] = useState(0);
  const [frameResetKey, setFrameResetKey] = useState(`${city}-${category}`);

  if (frameResetKey !== `${city}-${category}`) {
    setFrameResetKey(`${city}-${category}`);
    setCategoryFrameIndex(0);
    setNearbyFrameIndex(0);
  }

  const visibleCities = cities.includes(city as (typeof cities)[number]) ? [...cities] : [city, ...cities];
  const exactDirectoryItems = directory.filter((item) => item.city === city && item.category === category);
  const categoryMatrix = buildCategoryMatrix(city);
  const generatedCategoryResults = buildGeneratedResults(city, category, 10);
  const selectedItems: NearbyCard[] = [
    ...exactDirectoryItems.map((item) => ({
      name: item.name,
      area: item.area,
      eta: item.eta,
      query: `${item.name} ${item.area} ${item.city}`,
      category: item.category,
      why: item.tip
    })),
    ...generatedCategoryResults.filter(
      (generated) => !exactDirectoryItems.some((item) => generated.query.toLowerCase().includes(item.name.toLowerCase()))
    )
  ].slice(0, 10);
  const topTwentyPicks = categoryMatrix.flatMap((item) => item.results.slice(0, 2)).slice(0, 20);
  const seededNearbyItems: NearbyCard[] = selectedItems.slice(0, 5);
  const selectedCategory = categories.find((item) => item.key === category);
  const categoryLabel = selectedCategory?.label || "City";
  const cityVisual = cityVisuals[city] || {
    image: cityImageUrl(city),
    label: `${city} city`,
    position: "center"
  };
  const photoBlocks = [
    {
      title: "Hotels",
      text: "Stays near the route",
      image: cityVisual.image,
      query: `best hotels in ${city}`
    },
    {
      title: "Places",
      text: "Must-cover spots",
      image: cityVisual.image,
      query: `best places to visit in ${city}`
    },
    {
      title: "Fine Dining",
      text: "Dinner without guesswork",
      image: cityVisual.image,
      query: `fine dining restaurants in ${city}`
    },
    {
      title: categoryLabel,
      text: "Selected category nearby",
      image: cityVisual.image,
      query: `${categoryLabel} near ${city}`
    }
  ];
  const nearbyCards: NearbyCard[] = [...seededNearbyItems, ...topTwentyPicks].slice(0, 20);

  useEffect(() => {
    const savedLocation = window.localStorage.getItem(locationDataKey);
    if (savedLocation) {
      try {
        const parsedLocation = JSON.parse(savedLocation) as UserLocation;
        if (Number.isFinite(parsedLocation.lat) && Number.isFinite(parsedLocation.lng)) {
          setUserLocation(parsedLocation);
          if (parsedLocation.city) {
            setCity(parsedLocation.city);
            setLocationStatus(`Nearby mode restored for ${parsedLocation.city}. City tab, photos, and all 20 recommendations stay synced.`);
          } else {
            setLocationStatus("Nearby mode restored. Maps and recommendations use your saved current-location start.");
          }
          return;
        }
      } catch {
        window.localStorage.removeItem(locationDataKey);
      }
    }

    // The welcome intro now owns the on-load moment and offers location there,
    // so we no longer auto-pop the separate location prompt on first load.
  }, []);

  useEffect(() => {
    const startedAt = Date.now();
    trackActivity({ type: "page_view", city, category });

    return () => {
      trackActivity({
        type: "time_spent",
        city,
        category,
        value: Math.max(1, Math.round((Date.now() - startedAt) / 1000))
      });
    };
  }, []);

  function selectCity(nextCity: string, label = "selector") {
    setCity(nextCity);
    if (nextCity !== city && (!userLocation || (userLocation.city && userLocation.city !== nextCity))) {
      setShowLocationPrompt(true);
    }
    trackActivity({ type: "city_change", city: nextCity, category, label });
  }

  function selectCategory(nextCategory: CategoryKey, label = "selector") {
    setCategory(nextCategory);
    trackActivity({ type: "category_change", city, category: nextCategory, label });
  }

  function moveCategoryFrame(direction: -1 | 1) {
    const resultCount = selectedItems.length || 1;
    const nextIndex = (categoryFrameIndex + direction + resultCount) % resultCount;
    setCategoryFrameIndex(nextIndex);
    trackActivity({ type: "category_result_frame", city, category, label: `${nextIndex + 1}` });
  }

  function moveNearbyFrame(direction: -1 | 1) {
    const resultCount = nearbyCards.length || 1;
    const nextIndex = (nearbyFrameIndex + direction + resultCount) % resultCount;
    setNearbyFrameIndex(nextIndex);
    trackActivity({ type: "nearby_result_frame", city, category, label: `${nextIndex + 1}` });
  }

  function openTrackedMap(query: string, label: string) {
    trackActivity({ type: "map_open", city, category, label });
    window.open(mapDirectionsUrl(query, userLocation), "_blank", "noreferrer");
  }

  // Opens a Maps SEARCH (multiple pins) so the user can see several top spots
  // and pick one to navigate to, instead of jumping to a single destination.
  function openTrackedSearch(query: string, label: string) {
    trackActivity({ type: "map_search", city, category, label });
    window.open(mapSearchUrl(query, userLocation), "_blank", "noreferrer");
  }

  function openNearbyOptionsMap() {
    const query = `best ${categoryLabel} options near ${userLocation?.city || city}`;
    trackActivity({ type: "map_open", city: userLocation?.city || city, category, label: "nearby_options" });
    window.open(mapSearchUrl(query, userLocation), "_blank", "noreferrer");
  }

  function requestNearbyLocation() {
    setShowLocationPrompt(false);

    if (!navigator.geolocation) {
      setLocationStatus("Location is not supported in this browser. Maps will use city search instead.");
      return;
    }

    setLocationStatus("Asking browser for location permission...");
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const coords = {
          lat: Number(position.coords.latitude.toFixed(6)),
          lng: Number(position.coords.longitude.toFixed(6))
        };
        let detectedCity: string | null = null;

        try {
          const response = await fetch(`/api/reverse-location?lat=${coords.lat}&lng=${coords.lng}`);
          const payload = (await response.json()) as { city?: string | null };
          detectedCity = payload.city || null;
        } catch {
          detectedCity = null;
        }

        const nextLocation = detectedCity ? { ...coords, city: detectedCity } : coords;
        setUserLocation(nextLocation);
        window.localStorage.setItem(locationPromptKey, "enabled");
        window.localStorage.setItem(locationDataKey, JSON.stringify(nextLocation));
        if (detectedCity) {
          setCity(detectedCity);
          setLocationStatus(`Nearby mode on for ${detectedCity}. City tab, photos, and all 20 recommendations now sync from your current location.`);
        } else {
          setLocationStatus("Nearby mode on. All 20 smart picks stay available, and Maps/PDF routes now start from your current location.");
        }
        trackActivity({
          type: "location_enabled",
          city: detectedCity || city,
          category,
          label: detectedCity ? `${detectedCity} ${coords.lat},${coords.lng}` : `${coords.lat},${coords.lng}`
        });
      },
      () => {
        setLocationStatus("Location permission was not enabled. CityMitra will still use city-level map searches.");
        window.localStorage.setItem(locationPromptKey, "denied");
        trackActivity({ type: "location_denied", city, category });
      },
      { enableHighAccuracy: true, maximumAge: 300000, timeout: 10000 }
    );
  }

  function dismissLocationPrompt() {
    setShowLocationPrompt(false);
    window.localStorage.setItem(locationPromptKey, "dismissed");
    trackActivity({ type: "location_prompt_dismissed", city, category });
  }

  function handleSceneAction(action: "sync" | "map" | "route") {
    if (action === "sync") {
      document.getElementById("directory")?.scrollIntoView({ behavior: "smooth" });
      trackActivity({ type: "scene_action", city, category, label: "city_sync" });
      return;
    }

    if (action === "map") {
      openTrackedMap(`${categoryLabel} near ${city}`, "scene_map_picks");
      return;
    }

    document.getElementById("ai")?.scrollIntoView({ behavior: "smooth" });
    trackActivity({ type: "scene_action", city, category, label: "route_mode" });
  }

  function applySearch(trimmedSearch: string) {
    const detectedCategory = detectCategoryFromText(trimmedSearch);
    const cityFromText =
      detectCityFromMessage(trimmedSearch) ||
      cleanCityCandidate(
        categoryKeywords.reduce(
          (current, item) => item.words.reduce((text, word) => text.replace(new RegExp(`\\b${word}\\b`, "gi"), " "), current),
          trimmedSearch
        )
      );

    if (cityFromText) {
      selectCity(cityAliases[cityFromText.toLowerCase()] || cityFromText, "top_search");
    }

    if (detectedCategory) {
      selectCategory(detectedCategory, "top_search");
    }

    const activeCity = cityFromText || city;
    trackActivity({ type: "search_submit", city: activeCity, category: detectedCategory || category, label: trimmedSearch });
    document.getElementById("directory")?.scrollIntoView({ behavior: "smooth" });
  }

  return (
    <MotionConfig reducedMotion="user">
      <main id="main">
      <WelcomeIntro
        onAskAI={() => document.getElementById("ai")?.scrollIntoView({ behavior: "smooth" })}
        onBrowseCategories={() => document.getElementById("directory")?.scrollIntoView({ behavior: "smooth" })}
        onEnableLocation={requestNearbyLocation}
      />
      <LocationPrompt
        open={showLocationPrompt}
        hasLocation={Boolean(userLocation)}
        city={city}
        onEnable={requestNearbyLocation}
        onDismiss={dismissLocationPrompt}
      />

      <SiteHeader onSearch={applySearch} />

      <Hero
        city={city}
        categoryLabel={categoryLabel}
        cityVisual={cityVisual}
        nearbyCount={nearbyCards.length}
        userLocation={userLocation}
        onSceneAction={handleSceneAction}
        onOpenMap={openTrackedMap}
      />

      <DirectoryExplorer
        city={city}
        category={category}
        visibleCities={visibleCities}
        selectedItems={selectedItems}
        exactDirectoryItems={exactDirectoryItems}
        categoryFrameIndex={categoryFrameIndex}
        onSelectCity={selectCity}
        onSelectCategory={selectCategory}
        onMoveFrame={moveCategoryFrame}
        onSetFrame={setCategoryFrameIndex}
        onOpenMap={openTrackedMap}
        onSearchMap={openTrackedSearch}
      />

      <AiTeaser
        city={city}
        category={category}
        categoryLabel={categoryLabel}
        nearbyPanel={
          <NearbyPanel
            city={city}
            category={category}
            categoryLabel={categoryLabel}
            userLocation={userLocation}
            locationStatus={locationStatus}
            nearbyCards={nearbyCards}
            nearbyFrameIndex={nearbyFrameIndex}
            photoBlocks={photoBlocks}
            onRequestLocation={requestNearbyLocation}
            onMoveFrame={moveNearbyFrame}
            onSetFrame={setNearbyFrameIndex}
            onOpenMap={openTrackedMap}
            onOpenNearbyOptions={openNearbyOptionsMap}
          />
        }
      />

      <CoverageSection />
      <AboutSection />

      <SiteFooter city={city} category={category} />
      </main>
    </MotionConfig>
  );
}
