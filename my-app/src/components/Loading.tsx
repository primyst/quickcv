export default function Loading() {
  return (
    <div className="h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-teal-50">
      <div className="relative w-16 h-16">
        {/* Gradient shimmer ring */}
        <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-blue-600 border-r-teal-500 animate-spin" />
        {/* Inner glow */}
        <div className="absolute inset-2 rounded-full bg-gradient-to-br from-blue-600 to-teal-600 animate-pulse" />
      </div>
      <span className="ml-4 text-xl font-semibold bg-gradient-to-r from-blue-600 to-teal-600 bg-clip-text text-transparent animate-pulse">
        Loading SnapToDoc...
      </span>
    </div>
  );
}