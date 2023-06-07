import React from "react";

import { TruncatableText } from "../truncatable-text";
import "./demo.css";

export const Demo: React.FC = () => {
  return (
    <div className="main">
      <TruncatableText className="field" tailLength={3} debounced>
        This is the super long text that should be truncated!
      </TruncatableText>
    </div>
  );
};
