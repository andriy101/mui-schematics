export interface Schema {
  /** The path within /src to create the component. */
  path: string;

  /** The name of the component. */
  name: string;

  /** Flag to indicate if a dir is created. */
  flat: boolean;

  /** Where should be initial imports added. */
  mainFile: string;

  /** Perform initial install. */
  init: boolean;

  /** Flag to indicate if a stepper is vertical. */
  vertical: boolean;
}