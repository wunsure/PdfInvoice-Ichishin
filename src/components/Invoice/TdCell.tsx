// TdCell.tsx
import React from "react"

type TdCellProps = {
  children?: React.ReactNode
  primaryColor?: string
  className?: string
  style?: React.CSSProperties
  rowIndex?: number           // 新增
  secondaryColor?: string     // 偶數行顏色
}

const TdCell: React.FC<TdCellProps> = ({
  children,
  primaryColor = "#00b050",
  className,
  style,
  rowIndex,
  secondaryColor = "#f3f3f3",
}) => {
  const bgColor =
    rowIndex !== undefined ? (rowIndex % 2 === 0 ? secondaryColor : "#ffffff") : "#ffffff"

  return (
    <td
      className={`border px-2 py-1 text-sm text-left ${className || ""}`}
      style={{
        borderColor: primaryColor,
        borderStyle: "solid",
        borderWidth: "1px",
        backgroundColor: bgColor,
        ...style,
      }}
    >
      {children}
    </td>
  )
}

export default TdCell