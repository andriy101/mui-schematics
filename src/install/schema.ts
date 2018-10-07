export interface Schema {
  /** Whether to skip package.json install. */
  skipInstallModules: boolean;
  
  /** Where should be initial imports added. */
  mainFile: string;

  /** Name of pre-built theme to install. */
  theme: 'light' | 'dark';
}