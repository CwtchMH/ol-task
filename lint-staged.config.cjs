module.exports = {
    '*.{js,jsx,ts,tsx}': ['pnpm run lint-fix'],
    '*.{json,md,yml}': ['prettier --write'],
}