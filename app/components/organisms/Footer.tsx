export default function Footer() {
  return (
    <footer className="bg-gray-800 text-white py-6">
      <div className="container mx-auto px-6">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <p className="text-sm mb-2 md:mb-0">
            &copy; {new Date().getFullYear()} Compare System. All rights
            reserved.
          </p>
          <div className="flex gap-4 text-sm">
            <a href="#" className="hover:text-gray-300">
              利用規約
            </a>
            <a href="#" className="hover:text-gray-300">
              プライバシーポリシー
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
