import type { Meta, StoryObj } from "@storybook/react";

import { Colors, EColors } from "./colors";

// More on how to set up stories at: https://storybook.js.org/docs/writing-stories#default-export
const meta = {
  title: "Example/Colros",
  component: Colors,
  parameters: {
    // Optional parameter to center the component in the Canvas. More info: https://storybook.js.org/docs/configure/story-layout
    layout: "centered",
  },
  // This component will have an automatically generated Autodocs entry: https://storybook.js.org/docs/writing-docs/autodocs
  tags: ["autodocs"],
  // More on argTypes: https://storybook.js.org/docs/api/argtypes
  argTypes: {
  },
  // Use `fn` to spy on the onClick arg, which will appear in the actions panel once invoked: https://storybook.js.org/docs/essentials/actions#action-args
  // args: { onClick: fn() },
} satisfies Meta<typeof Colors>;

export default meta;
type Story = StoryObj<typeof meta>;

// More on writing stories with args: https://storybook.js.org/docs/writing-stories/args
export const Primary: Story = {
  args: {
    color: EColors.primary 
  },
};

export const Grey: Story = {
  args: {
    color: EColors.grey 
  },
};
export const Red: Story = {
  args: {
    color: EColors.red 
  },
};
export const Black: Story = {
  args: {
    color: EColors.black 
  },
};
export const LightGrey: Story = {
  args: {
    color: EColors.lightGrey 
  },
};
export const DarkBlack: Story = {
  args: {
    color: EColors.darkBlack 
  },
};