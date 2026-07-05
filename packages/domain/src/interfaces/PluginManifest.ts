/**
 * Defines the capabilities and extensions a plugin contributes to PKOS.
 * 
 * Why: Allows third-party logic to dynamically extend the ubiquitous language
 * without modifying core domain code.
 * 
 * Invariants:
 * - A plugin must have a unique identifier and version.
 * - Actions and Capabilities registered must not conflict with core definitions.
 * 
 * Owner: The Plugin Registry / Extensibility Subsystem.
 */
export interface PluginManifest {
  readonly id: string;
  readonly name: string;
  readonly version: string;
  
  readonly entityTypes: string[];
  readonly relationshipTypes: string[];
  readonly capabilities: string[];
  readonly traits: string[];
  
  // Handlers for specific commands or domain actions
  readonly commands: string[];
  readonly parsers: string[];
}
