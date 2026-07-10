// Side-effect CSS imports carry no type surface — declare them so tsc's
// declaration build doesn't choke on `import "./Button.css"`.
declare module "*.css";
