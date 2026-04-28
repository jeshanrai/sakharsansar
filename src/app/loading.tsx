import JaggeryLoader from "@/components/ui/JaggeryLoader";

export default function Loading() {
  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-cream/85 backdrop-blur-sm">
      <JaggeryLoader />
    </div>
  );
}
