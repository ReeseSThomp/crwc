/**
 * Test if a node is a child of another Node in a potentially different component
 *
 * @param possibleParent
 * @param e
 */
const containsTargetPenetrate = (possibleParent: Node, e: Event): boolean => {
	// shadowdom
	if (e.composedPath) {
		const targets = /** @type {!Array<!EventTarget>} */ e.composedPath();
		return !!targets.find((target: EventTarget): boolean => possibleParent === target);
	}
	// shadydom
	return !!possibleParent.contains(e.target as Node | null);
};

export default containsTargetPenetrate;
