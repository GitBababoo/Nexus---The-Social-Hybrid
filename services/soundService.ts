
// Neural Sound Engine - Silent Mode
// Sound effects have been disabled per user request.

class SoundEngine {
  private enabled: boolean = false;

  constructor() {}

  public setEnabled(enabled: boolean) {
    this.enabled = enabled;
  }

  // All methods are now no-ops to ensure silence
  public playHover() {}

  public playClick() {}

  public playSuccess() {}

  public playError() {}

  public playNotification() {}

  public playMint() {}
}

export const soundEngine = new SoundEngine();
