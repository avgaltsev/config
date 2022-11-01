import {JsonObject, isJsonObject} from "@somethings/json";

export function mergeConfigs<T extends JsonObject, K extends keyof T>(baseConfig: T, overrideConfig: JsonObject): T {
	const properties = Object.keys(baseConfig) as Array<K>;

	return properties.reduce((result, property) => {
		// Typescript bug: baseValue infers correct type here (T[K], or Json),
		// but when I try use it somewhere it thinks it's Json | undefined.
		// If I specify the type explicitly, it works fine.
		const baseValue: T[K] = baseConfig[property];
		const overrideValue = overrideConfig[property as string];

		if (isJsonObject(baseValue)) {
			if (overrideValue === undefined) {
				result[property] = baseValue;
			} else if (isJsonObject(overrideValue)) {
				result[property] = mergeConfigs(baseValue, overrideValue);
			} else {
				result[property] = baseValue;
			}
		} else {
			if (typeof baseValue === typeof overrideValue) {
				result[property] = overrideValue as T[K];
			} else {
				result[property] = baseValue;
			}
		}

		return result;
	}, {...baseConfig});
}
