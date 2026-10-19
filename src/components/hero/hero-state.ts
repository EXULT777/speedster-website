/**
 * Value shared between the page (hovering a call button) and the 3D key,
 * which reads it every frame. Plain mutable data: never triggers a render.
 */
export const heroState = {
  /** 1 while a call button is hovered or focused. */
  press: 0,
};
