import type { HTMLAttributes } from "react";

type Props = HTMLAttributes<HTMLDivElement> & {
  as?: "div" | "section" | "header" | "footer";
};

export default function Container({
  className = "",
  as: Tag = "div",
  ...rest
}: Props) {
  return (
    <Tag
      className={`mx-auto w-full max-w-[1100px] px-5 sm:px-6 ${className}`}
      {...rest}
    />
  );
}
