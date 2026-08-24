import * as React from "react";

export function Image({
  src,
  alt = "",
  className,
  fittingType,
  style,
  ...props
}: React.ImgHTMLAttributes<HTMLImageElement>) {
  return <img src={src} alt={alt} className={className} style={{ objectFit: fittingType === "contain" ? "contain" : fittingType === "fill" ? "cover" : style?.objectFit, ...style }} {...props} />;
}