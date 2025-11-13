export default function PricingPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center text-center p-8">
      <h1 className="text-4xl font-bold mb-4">Choose Your Plan</h1>
      <p className="text-gray-600 max-w-md mb-8">
        Upgrade to Pro to unlock unlimited document conversions and faster processing.
      </p>
      <div className="bg-white shadow-lg rounded-2xl p-6 w-80">
        <h2 className="text-xl font-semibold mb-2">Pro Plan</h2>
        <p className="text-gray-500 mb-4">₦2,500 / month</p>
        <button className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg transition">
          Subscribe
        </button>
      </div>
    </div>
  );
}