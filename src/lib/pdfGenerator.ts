import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

/**
 * 将指定的 HTML 元素转换为 PDF 并触发下载。
 * @param element - 需要转换为 PDF 的 HTMLDivElement。
 * @param fileName - 下载的 PDF 文件名。
 */
export const downloadPdf = async (element: HTMLDivElement, fileName: string): Promise<void> => {
  // 添加一个临时 class 用于导出时优化样式，例如去除不必要的阴影
  element.classList.add("export-mode");
  // 记录原始的 transform 样式，以便恢复
  const originalTransform = element.style.transform;
  // 导出时强制缩放为 1，确保最高清晰度
  element.style.transform = "scale(1)";

  try {
    const canvas = await html2canvas(element, { 
      scale: 4, // 提高渲染分辨率，解决模糊问题
      useCORS: true 
    });
    
    const imgData = canvas.toDataURL("image/png");
    const a4Width_mm = 210;
    const a4Height_mm = 297;
    const imgWidth_px = canvas.width;
    const imgHeight_px = canvas.height;
    const imgRatio = imgWidth_px / imgHeight_px;

    let pdfImgWidth = a4Width_mm;
    let pdfImgHeight = a4Width_mm / imgRatio;

    // 如果图片高度超出 A4，则以高度为基准重新计算宽度
    if (pdfImgHeight > a4Height_mm) {
      pdfImgHeight = a4Height_mm;
      pdfImgWidth = a4Height_mm * imgRatio;
    }

    const pdf = new jsPDF("portrait", "mm", "a4");
    const xOffset = (a4Width_mm - pdfImgWidth) / 2; // 居中放置
    
    pdf.addImage(imgData, "PNG", xOffset, 0, pdfImgWidth, pdfImgHeight);
    pdf.save(`${fileName}.pdf`);

  } catch (err) {
    console.error("PDF生成失败:", err);
    alert("PDF生成中にエラーが発生しました。");
  } finally {
    // 无论成功或失败，都恢复原始样式
    element.style.transform = originalTransform;
    element.classList.remove("export-mode");
  }
};