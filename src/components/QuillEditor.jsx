import ReactQuill from "react-quill-new";
import "react-quill-new/dist/quill.snow.css";
import { Controller } from "react-hook-form";

export default function QuillEditor({ name, control, defaultValue = "" }) {
  const modules = {
    toolbar: [
      [{ header: [1, 2, 3, false] }],
      ["bold", "italic", "underline", "strike"],
      [{ color: [] }, { background: [] }],
      [{ list: "ordered" }, { list: "bullet" }],
      ["blockquote", "code-block"],
      ["link", "image"],
      ["clean"],
    ],
  };

  return (
    <div className="mb-4">
      <label className="block mb-1 font-medium text-gray-700">Content :</label>
      <Controller
        name={name}
        control={control}
        defaultValue={defaultValue}
        render={({ field }) => (
          <ReactQuill
            theme="snow"
            value={field.value}
            onChange={field.onChange}
            modules={modules}
            className="bg-white rounded-lg"
            style={{ minHeight: "300px" }}
          />
        )}
      />
    </div>
  );
}
