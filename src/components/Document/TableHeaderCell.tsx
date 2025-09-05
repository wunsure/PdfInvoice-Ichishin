import React from 'react'
import type { ReactNode } from 'react'

type Props = {
  children?: ReactNode
  primaryColor?: string
  rowSpan?: number
  className?: string       // 可選額外 class
  style?: React.CSSProperties // 可選額外行內樣式
  fontSize?: string | number // 新增：可控制字體大小
}

const TableHeaderCell: React.FC<Props> = ({
  children,
  primaryColor = "#00b050",
  rowSpan,
  className,
  style,
  
}) => (
  <th
    className={`border px-4 py-2 text-left text-white ${className || ''}`}
    style={{
      backgroundColor: primaryColor,
      borderStyle: 'solid',
      borderWidth: '1px',
      borderColor: primaryColor,
      fontSize:'12px',
      ...style,          // 合併額外樣式
    }}
    rowSpan={rowSpan}
  >
    {children}
  </th>
)

export default TableHeaderCell