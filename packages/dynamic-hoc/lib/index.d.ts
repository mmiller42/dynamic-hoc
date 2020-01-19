// Type definitions for dynamic-hoc
// Project: dynamic-hoc

/*~ This declaration specifies that the function
 *~ is the exported object from the file
 */
import { ComponentType } from 'react'

export default createDynamicHoc
export as namespace DynamicHoc
export const createDynamicHoc: CreateDynamicHoc

type CreateDynamicHoc<HocFactoryArgs> = (
  /**
   * The factory function which produces a React HOC.
   */
  hocFactory: HocFactory<HocFactoryArgs>,
  /**
   * The names of the arguments to `hocFactory`: arguments can be modified on
   * the returned HOC by setting a property with the arg name, e.g.
   * `dynamicHoc.args[argName] = newValue`.
   * Or, the number of arguments to `hocFactory`: arguments can be modified on
   * the returned HOC by setting a property with the arg index, e.g.
   * `dynamicHoc.args[argIndex] = newValue`.
   * If null or undefined, arguments can be modified by replacing the array on
   * the returned HOC, e.g. `dynamicHoc.args = [newValue1, ..., newValueN]`.
   */
  argNamesOrArity?: number | string[],
  /**
   * The display name for the HOC. The component wrapped by the HOC will have
   * its `displayName` property set to `dynamicHoc(hocName)(componentName)`.
   * If a falsy value, defaults to `hocFactory.name` or an empty string.
   */
  hocName?: string,
) => DynamicHocFactory<HocFactoryArgs>

type DynamicHocFactory<HocFactoryArgs> = HocFactory<HocFactoryArgs>
type Hoc = (Component: ComponentType) => ComponentType
type HocFactory<HocFactoryArgs = any[]> = (...args: HocFactoryArgs) => Hoc
