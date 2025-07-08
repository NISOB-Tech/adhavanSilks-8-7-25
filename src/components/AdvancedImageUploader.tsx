import React, { useCallback, useState, useEffect } from "react";
import { useDropzone } from "react-dropzone";
import { DndContext, closestCenter, DragEndEvent } from "@dnd-kit/core";
import { arrayMove, SortableContext, useSortable, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

export interface UploadedImage {
  url: string;
  filename: string;
  isPrimary: boolean;
}

interface AdvancedImageUploaderProps {
  onUpload?: (images: UploadedImage[]) => void;
}

function SortableImage({
  id,
  url,
  isPrimary,
  onSetPrimary,
  onRemove,
  listeners,
  attributes,
  style
}: {
  id: string;
  url: string;
  isPrimary: boolean;
  onSetPrimary: () => void;
  onRemove: () => void;
  listeners?: any;
  attributes?: any;
  style?: React.CSSProperties;
}) {
  return (
    <div
      style={{
        ...style,
        border: isPrimary ? "2px solid #007bff" : "1px solid #ccc",
        borderRadius: 8,
        padding: 4,
        marginBottom: 8,
        background: "#fff",
        position: "relative",
        width: 100,
        height: 100,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center"
      }}
      {...attributes}
      {...listeners}
    >
      <img src={url} alt="" style={{ width: 80, height: 80, objectFit: "cover", borderRadius: 4 }} />
      <button
        type="button"
        style={{
          position: "absolute",
          top: 2,
          right: 2,
          background: "#fff",
          border: "none",
          borderRadius: "50%",
          cursor: "pointer",
          fontWeight: "bold"
        }}
        onClick={onRemove}
        title="Remove"
      >
        ×
      </button>
      <button
        type="button"
        style={{
          marginTop: 4,
          fontSize: 12,
          color: isPrimary ? "#007bff" : "#888",
          background: "none",
          border: "none",
          cursor: "pointer"
        }}
        onClick={onSetPrimary}
        title="Set as primary"
      >
        {isPrimary ? "Primary" : "Set Primary"}
      </button>
    </div>
  );
}

function DraggableImage({
  id,
  url,
  isPrimary,
  onSetPrimary,
  onRemove
}: {
  id: string;
  url: string;
  isPrimary: boolean;
  onSetPrimary: () => void;
  onRemove: () => void;
}) {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id });
  const style: React.CSSProperties = {
    transform: CSS.Transform.toString(transform),
    transition,
    marginRight: 8
  };
  return (
    <div ref={setNodeRef} style={style}>
      <SortableImage
        id={id}
        url={url}
        isPrimary={isPrimary}
        onSetPrimary={onSetPrimary}
        onRemove={onRemove}
        listeners={listeners}
        attributes={attributes}
        style={{}}
      />
    </div>
  );
}

const AdvancedImageUploader: React.FC<AdvancedImageUploaderProps> = ({ onUpload }) => {
  const [images, setImages] = useState<UploadedImage[]>([]);
  const [uploading, setUploading] = useState(false);

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    setUploading(true);
    const formData = new FormData();
    for (let file of acceptedFiles) formData.append("images", file);
    const res = await fetch("/api/upload", { method: "POST", body: formData });
    const data = await res.json();
    setImages((prev) => [
      ...prev,
      ...data.files.map((f: any) => ({ url: f.url, filename: f.filename, isPrimary: false }))
    ]);
    setUploading(false);
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop, accept: { "image/*": [] }, multiple: true });

  // Reordering logic
  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (active.id !== over?.id) {
      setImages((items) => {
        const oldIndex = items.findIndex((img) => img.filename === active.id);
        const newIndex = items.findIndex((img) => img.filename === over?.id);
        return arrayMove(items, oldIndex, newIndex);
      });
    }
  };

  // Set primary image
  const setPrimary = (filename: string) => {
    setImages((imgs) =>
      imgs.map((img) => ({
        ...img,
        isPrimary: img.filename === filename
      }))
    );
  };

  // Remove image
  const removeImage = (filename: string) => {
    setImages((imgs) => imgs.filter((img) => img.filename !== filename));
  };

  // Notify parent on change
  useEffect(() => {
    if (onUpload) onUpload(images);
  }, [images, onUpload]);

  return (
    <div>
      <div
        {...getRootProps()}
        style={{
          border: "2px dashed #aaa",
          borderRadius: 8,
          padding: 16,
          textAlign: "center",
          background: isDragActive ? "#f0f8ff" : "#fafafa",
          marginBottom: 16,
          cursor: "pointer"
        }}
      >
        <input {...getInputProps()} />
        {uploading ? "Uploading..." : "Drag & drop images here, or click to select"}
      </div>
      <DndContext collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
        <SortableContext items={images.map((img) => img.filename)} strategy={verticalListSortingStrategy}>
          <div style={{ display: "flex", flexDirection: "row", flexWrap: "wrap" }}>
            {images.map((img) => (
              <DraggableImage
                key={img.filename}
                id={img.filename}
                url={img.url}
                isPrimary={!!img.isPrimary}
                onSetPrimary={() => setPrimary(img.filename)}
                onRemove={() => removeImage(img.filename)}
              />
            ))}
          </div>
        </SortableContext>
      </DndContext>
    </div>
  );
};

export default AdvancedImageUploader; 