import type { Meta, StoryObj } from "@storybook/react";

import { Button, ButtonBG } from "./button";

// More on how to set up stories at: https://storybook.js.org/docs/writing-stories#default-export
const meta = {
  title: "Example/Button",
  component: Button,
  parameters: {
    // Optional parameter to center the component in the Canvas. More info: https://storybook.js.org/docs/configure/story-layout
    layout: "centered",
  },
  // This component will have an automatically generated Autodocs entry: https://storybook.js.org/docs/writing-docs/autodocs
  tags: ["autodocs"],
  // More on argTypes: https://storybook.js.org/docs/api/argtypes
  argTypes: {
    bg: {
      options: Object.values(ButtonBG).filter(
        (value) => typeof value === "number"
      ),
      control: { type: "select" },
    },
  },
  // Use `fn` to spy on the onClick arg, which will appear in the actions panel once invoked: https://storybook.js.org/docs/essentials/actions#action-args
  // args: { onClick: fn() },
} satisfies Meta<typeof Button>;

export default meta;
type Story = StoryObj<typeof meta>;

// More on writing stories with args: https://storybook.js.org/docs/writing-stories/args
export const Primary: Story = {
  args: {
    label: "Button",
    bg: ButtonBG.primary,
  },
};

export const Red: Story = {
  args: {
    label: "Button",
    bg: ButtonBG.red,
  },
};

export const Grey: Story = {
  args: {
    label: "Button",
    bg: ButtonBG.grey,
  },
};

export const Orange: Story = {
  args: {
    label: "Button",
    bg: ButtonBG.orange,
  },
};

export const White: Story = {
  args: {
    label: "Button",
    bg: ButtonBG.white,
  },
};