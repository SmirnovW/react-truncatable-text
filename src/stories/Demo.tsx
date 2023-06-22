import React from "react";

import { TruncatableText } from "../react-truncatable-text";
import "./demo.css";

export const Demo: React.FC = () => {
  return (
    <div className="main">
      <TruncatableText className="field" tailLength={3} debounced searchable>
        This is the super long text that should be truncated!
      </TruncatableText>
    </div>
  );
};
