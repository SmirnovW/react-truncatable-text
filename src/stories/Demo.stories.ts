import { Demo } from "./Demo";
import { StoryObj } from "@storybook/react";

const meta = {
  title: "Example/Demo",
  component: Demo,
  tags: ["autodocs"],
  parameters: {
    // More on how to position stories at: https://storybook.js.org/docs/react/configure/story-layout
    layout: "fullscreen",
  },
};

export default meta;

type Story = StoryObj<typeof meta>;

export const Component: Story = {};
