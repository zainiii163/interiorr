import React from 'react';

export default class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { error: null };
  }

  static getDerivedStateFromError(error) {
    return { error };
  }

  render() {
    if (this.state.error) {
      return (
        <div className="min-h-screen bg-stone-50 flex items-center justify-center p-6">
          <div className="max-w-md text-center space-y-4">
            <h1 className="font-serif text-2xl font-bold text-stone-900">Something went wrong</h1>
            <p className="text-sm text-stone-600">Please refresh the page. If the problem continues, contact support.</p>
            <button
              type="button"
              onClick={() => window.location.reload()}
              className="btn-terracotta px-6 py-3 rounded-xl text-sm font-semibold"
            >
              Refresh page
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}
