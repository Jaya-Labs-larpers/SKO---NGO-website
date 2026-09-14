export function deploymentEnvironment(env: Record<string, string | undefined>): string;
export function validateBuildConfig(env: Record<string, string | undefined>): string[];
export function contentFailures(html: string, page: string): string[];
export function siteSettingsFailures(settings: object): string[];
