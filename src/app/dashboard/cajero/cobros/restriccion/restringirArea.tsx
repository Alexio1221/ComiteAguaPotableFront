import { Modifier } from '@dnd-kit/core';

export function restringirComponente(containerId: string): Modifier {
  return ({ transform, activeNodeRect }) => {
    const container = document.getElementById(containerId);
    if (!container || !activeNodeRect) return transform;

    const containerRect = container.getBoundingClientRect();

    const maxX = containerRect.right - activeNodeRect.width;
    const maxY = containerRect.bottom - activeNodeRect.height;
    const minX = containerRect.left;
    const minY = containerRect.top;

    const nextX = Math.min(Math.max(transform.x + activeNodeRect.left, minX), maxX) - activeNodeRect.left;
    const nextY = Math.min(Math.max(transform.y + activeNodeRect.top, minY), maxY) - activeNodeRect.top;

    return {
      ...transform,
      x: nextX,
      y: nextY,
    };
  };
}
