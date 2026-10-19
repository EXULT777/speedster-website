"use client";

import { Component, type ReactNode } from "react";

/** If a 3D scene throws (driver or context problems), render nothing and report it so the caller can show its static fallback. */
export class SceneBoundary extends Component<{ onError: () => void; children: ReactNode }, { failed: boolean }> {
  state = { failed: false };
  static getDerivedStateFromError() {
    return { failed: true };
  }
  componentDidCatch() {
    this.props.onError();
  }
  render() {
    return this.state.failed ? null : this.props.children;
  }
}
