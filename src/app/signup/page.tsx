import { PublicLayout } from '../../components/layout/PublicLayout';

export default function Signup() {
  return (
    <PublicLayout>
      <div className="max-w-md mx-auto mt-20 p-6 bg-white rounded-lg shadow">
        <h2 className="text-2xl font-bold mb-6 text-center">Sign Up</h2>
        <form>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">College Email</label>
            <input type="email" required pattern=".*@.*\.edu$" className="w-full border rounded p-2 focus:ring-primary-500 focus:border-primary-500" placeholder="student@college.edu" />
          </div>
          <button type="submit" className="w-full bg-primary-600 text-white py-2 rounded hover:bg-primary-700">Sign Up</button>
        </form>
      </div>
    </PublicLayout>
  );
}