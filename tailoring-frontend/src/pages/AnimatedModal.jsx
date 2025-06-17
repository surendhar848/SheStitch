export default function AnimatedModal({ open, children, onClose }) {
  return (
    <div className={`fixed inset-0 z-40 flex items-center justify-center bg-black/40 transition-opacity duration-300 ${open ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"}`}>
      <div className={`bg-white rounded-lg shadow-xl max-w-md w-full p-6 transform transition-all duration-300 ${open ? "scale-100" : "scale-95"}`}>
        <button className="absolute top-4 right-7 text-2xl text-gray-400 hover:text-red-500" onClick={onClose}>&times;</button>
        {children}
      </div>
    </div>
  );
}