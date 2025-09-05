import React from "react";

export type CustomTextLine = {
  text: string;
  color?: string;
  fontSize?: string;
  className?: string;
  style?: React.CSSProperties;
  align?: "left" | "center" | "right";
  marginTop?: string;
  ellipsis?: boolean;
};

type Props = {
  lines: CustomTextLine[];
  containerClassName?: string;
  defaultLineGap?: string;
  fontSize?: string;
  lineHeight?: string | number;
  marginBottom?: string | number;
  color?: string;
};

const CustomTextLines: React.FC<Props> = ({
  lines,
  containerClassName,
  defaultLineGap = "0.25rem",
  fontSize = "0.65rem",
  // 👇 把 lineHeight 和 marginBottom 添加到这里 👇
  lineHeight = 1.5,
  marginBottom = 0,
  color = "#808080",
}) => {
  if (!lines || lines.length === 0) return null;

  return (
    // 现在这里的 marginBottom 能找到值了
    <div className={`w-full ${containerClassName || ""}`} style={{ marginBottom }}>
      {lines.map((line, idx) => {
        const alignClass =
          line.align === "center"
            ? "text-center"
            : line.align === "right"
            ? "text-right"
            : "text-left";
        const ellipsisClass = line.ellipsis ? "truncate overflow-hidden whitespace-nowrap max-w-full" : "";

        return (
          <p
            key={idx}
            className={`${alignClass} ${ellipsisClass} ${line.className || ""}`}
            style={{
              fontSize: line.fontSize || fontSize,
              color: line.color || color,
              marginTop: line.marginTop || (idx > 0 ? defaultLineGap : undefined),
              // 现在这里的 lineHeight 也能找到值了
              lineHeight: lineHeight,
              ...line.style
            }}
          >
            {line.text}
          </p>
        );
      })}
    </div>
  );
};

export default CustomTextLines;