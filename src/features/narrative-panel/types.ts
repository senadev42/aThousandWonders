// scene description types
export type NarrativePayload = {
  normal: string;
  firstTime?: string;
  investigate?: {
    check: number;
    success: string;
    fail: string;
  };
};

export type SceneNPDescriptions = Record<string, NarrativePayload>;
