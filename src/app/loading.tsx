import JaggeryLoader from "@/components/ui/JaggeryLoader";

export default function Loading() {
  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-earth-beige/80 backdrop-blur-sm">
      <JaggeryLoader />
    </div>
  );
}
