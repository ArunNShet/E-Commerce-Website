import React, { useMemo, useState } from "react";
import { resolveImageUrl } from "../lib/image";

function ProductImage({ imageUrl, productName, className = "" }) {
  const [hasError, setHasError] = useState(false);
  const resolvedUrl = useMemo(() => resolveImageUrl(imageUrl), [imageUrl]);
  const shouldShowFallback = !imageUrl || hasError;
  const imageClassName = `product-image ${className}`.trim();

  if (shouldShowFallback) {
    return (
      <div className={`${imageClassName} product-image-fallback`.trim()} aria-label={productName}>
        <span>{productName}</span>
      </div>
    );
  }

  return (
    <img
      className={imageClassName}
      src={resolvedUrl}
      alt={productName}
      onError={() => setHasError(true)}
    />
  );
}

export default ProductImage;
