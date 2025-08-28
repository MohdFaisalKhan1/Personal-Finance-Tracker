import React, { useState, useEffect } from 'react';
import { PlusCircle, DollarSign, TrendingUp, AlertTriangle, Trash2, Edit3, Save, X } from 'lucide-react';

const PersonalFinanceTracker = () => {
  const [transactions, setTransactions] = useState([
    { id: 1, amount: 85.50, category: 'groceries', description: 'Weekly groceries', date: '2025-08-25', type: 'expense' },
    { id: 2, amount: 1200.00, category: 'utilities', description: 'Electric bill', date: '2025-08-20', type: 'expense' },
    { id: 3, amount: 3500.00, category: 'salary', description: 'Monthly salary', date: '2025-08-01', type: 'income' },
    { id: 4, amount: 45.99, category: 'entertainment', description: 'Netflix subscription', date: '2025-08-15', type: 'expense' }
  ]);

  const [budgets, setBudgets] = useState({
    groceries: 400,
    utilities: 200,
    entertainment: 100,
    transportation: 150,
    healthcare: 100
  });

  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    amount: '',
    category: 'groceries',
    description: '',
    date: new Date().toISOString().split('T')[0],
    type: 'expense'
  });

  const categories = {
    expense: ['groceries', 'utilities', 'entertainment', 'transportation', 'healthcare', 'shopping', 'dining', 'other'],
    income: ['salary', 'freelance', 'investment', 'bonus', 'other']
  };

  const categoryColors = {
    groceries: '#FF6384',
    utilities: '#36A2EB', 
    entertainment: '#FFCE56',
    transportation: '#4BC0C0',
    healthcare: '#9966FF',
    shopping: '#FF9F40',
    dining: '#FF6384',
    salary: '#4BC0C0',
    freelance: '#36A2EB',
    investment: '#FFCE56',
    bonus: '#9966FF',
    other: '#C9CBCF'
  };

  // Auto-categorization logic
  const categorizTransaction = (description) => {
    const desc = description.toLowerCase();
    if (desc.includes('grocery') || desc.includes('food') || desc.includes('supermarket')) return 'groceries';
    if (desc.includes('electric') || desc.includes('water') || desc.includes('gas') || desc.includes('internet')) return 'utilities';
    if (desc.includes('netflix') || desc.includes('movie') || desc.includes('game')) return 'entertainment';
    if (desc.includes('uber') || desc.includes('gas') || desc.includes('parking')) return 'transportation';
    if (desc.includes('doctor') || desc.includes('pharmacy') || desc.includes('hospital')) return 'healthcare';
    return 'other';
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const newTransaction = {
      id: editingId || Date.now(),
      amount: parseFloat(formData.amount),
      category: formData.category || categorizTransaction(formData.description),
      description: formData.description,
      date: formData.date,
      type: formData.type
    };

    if (editingId) {
      setTransactions(prev => prev.map(t => t.id === editingId ? newTransaction : t));
      setEditingId(null);
    } else {
      setTransactions(prev => [...prev, newTransaction]);
    }

    setFormData({
      amount: '',
      category: 'groceries',
      description: '',
      date: new Date().toISOString().split('T')[0],
      type: 'expense'
    });
    setShowForm(false);
  };

  const handleEdit = (transaction) => {
    setFormData(transaction);
    setEditingId(transaction.id);
    setShowForm(true);
  };

  const handleDelete = (id) => {
    setTransactions(prev => prev.filter(t => t.id !== id));
  };

  const cancelEdit = () => {
    setEditingId(null);
    setShowForm(false);
    setFormData({
      amount: '',
      category: 'groceries',
      description: '',
      date: new Date().toISOString().split('T')[0],
      type: 'expense'
    });
  };

  // Calculate spending by category
  const spendingByCategory = transactions
    .filter(t => t.type === 'expense')
    .reduce((acc, t) => {
      acc[t.category] = (acc[t.category] || 0) + t.amount;
      return acc;
    }, {});

  // Calculate total income and expenses
  const totalIncome = transactions.filter(t => t.type === 'income').reduce((sum, t) => sum + t.amount, 0);
  const totalExpenses = transactions.filter(t => t.type === 'expense').reduce((sum, t) => sum + t.amount, 0);
  const netIncome = totalIncome - totalExpenses;

  // Budget alerts
  const budgetAlerts = Object.entries(spendingByCategory).filter(([category, spent]) => 
    budgets[category] && spent > budgets[category] * 0.8
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">Personal Finance Tracker</h1>
          <p className="text-gray-600">Track your spending, manage your budget, achieve your goals</p>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500 mb-1">Total Income</p>
                <p className="text-2xl font-bold text-green-600">${totalIncome.toFixed(2)}</p>
              </div>
              <TrendingUp className="w-8 h-8 text-green-500" />
            </div>
          </div>
          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500 mb-1">Total Expenses</p>
                <p className="text-2xl font-bold text-red-600">${totalExpenses.toFixed(2)}</p>
              </div>
              <DollarSign className="w-8 h-8 text-red-500" />
            </div>
          </div>
          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500 mb-1">Net Income</p>
                <p className={`text-2xl font-bold ${netIncome >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  ${netIncome.toFixed(2)}
                </p>
              </div>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${netIncome >= 0 ? 'bg-green-100' : 'bg-red-100'}`}>
                <span className={`text-lg ${netIncome >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {netIncome >= 0 ? '↗' : '↘'}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Budget Alerts */}
        {budgetAlerts.length > 0 && (
          <div className="bg-amber-50 border-l-4 border-amber-400 rounded-lg p-4 mb-6">
            <div className="flex items-center mb-2">
              <AlertTriangle className="w-5 h-5 text-amber-500 mr-2" />
              <h3 className="font-semibold text-amber-800">Budget Alerts</h3>
            </div>
            {budgetAlerts.map(([category, spent]) => (
              <p key={category} className="text-amber-700 text-sm">
                {category.charAt(0).toUpperCase() + category.slice(1)}: ${spent.toFixed(2)} / ${budgets[category]} 
                ({((spent / budgets[category]) * 100).toFixed(0)}% used)
              </p>
            ))}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Transaction Form */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-gray-800">
                {editingId ? 'Edit Transaction' : 'Add Transaction'}
              </h2>
              <button
                onClick={() => setShowForm(!showForm)}
                className="flex items-center px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
              >
                <PlusCircle className="w-4 h-4 mr-2" />
                Add New
              </button>
            </div>

            {showForm && (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Amount</label>
                    <input
                      type="number"
                      step="0.01"
                      value={formData.amount}
                      onChange={(e) => setFormData({...formData, amount: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                      placeholder="0.00"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
                    <select
                      value={formData.type}
                      onChange={(e) => setFormData({...formData, type: e.target.value, category: categories[e.target.value][0]})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    >
                      <option value="expense">Expense</option>
                      <option value="income">Income</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                    <select
                      value={formData.category}
                      onChange={(e) => setFormData({...formData, category: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    >
                      {categories[formData.type].map(cat => (
                        <option key={cat} value={cat}>
                          {cat.charAt(0).toUpperCase() + cat.slice(1)}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
                    <input
                      type="date"
                      value={formData.date}
                      onChange={(e) => setFormData({...formData, date: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                  <input
                    type="text"
                    value={formData.description}
                    onChange={(e) => setFormData({...formData, description: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    placeholder="Transaction description"
                    required
                  />
                </div>

                <div className="flex gap-3">
                  <button
                    type="submit"
                    className="flex items-center px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
                  >
                    <Save className="w-4 h-4 mr-2" />
                    {editingId ? 'Update' : 'Save'} Transaction
                  </button>
                  {(showForm || editingId) && (
                    <button
                      type="button"
                      onClick={cancelEdit}
                      className="flex items-center px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
                    >
                      <X className="w-4 h-4 mr-2" />
                      Cancel
                    </button>
                  )}
                </div>
              </form>
            )}
          </div>

          {/* Spending Chart */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-6">Spending by Category</h2>
            <div className="space-y-4">
              {Object.entries(spendingByCategory).map(([category, amount]) => {
                const percentage = (amount / totalExpenses) * 100;
                return (
                  <div key={category}>
                    <div className="flex justify-between items-center mb-2">
                      <span className="font-medium text-gray-700 capitalize">{category}</span>
                      <span className="text-gray-600">${amount.toFixed(2)}</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-3">
                      <div
                        className="h-3 rounded-full transition-all duration-300"
                        style={{
                          width: `${percentage}%`,
                          backgroundColor: categoryColors[category] || '#C9CBCF'
                        }}
                      ></div>
                    </div>
                    <div className="flex justify-between text-xs text-gray-500 mt-1">
                      <span>{percentage.toFixed(1)}% of expenses</span>
                      {budgets[category] && (
                        <span className={amount > budgets[category] ? 'text-red-500' : 'text-green-500'}>
                          Budget: ${budgets[category]}
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Recent Transactions */}
        <div className="bg-white rounded-xl shadow-lg p-6 mt-8">
          <h2 className="text-xl font-semibold text-gray-800 mb-6">Recent Transactions</h2>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-4 font-medium text-gray-700">Date</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-700">Description</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-700">Category</th>
                  <th className="text-right py-3 px-4 font-medium text-gray-700">Amount</th>
                  <th className="text-right py-3 px-4 font-medium text-gray-700">Actions</th>
                </tr>
              </thead>
              <tbody>
                {transactions
                  .sort((a, b) => new Date(b.date) - new Date(a.date))
                  .map(transaction => (
                  <tr key={transaction.id} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="py-3 px-4 text-gray-600">
                      {new Date(transaction.date).toLocaleDateString()}
                    </td>
                    <td className="py-3 px-4 text-gray-800">{transaction.description}</td>
                    <td className="py-3 px-4">
                      <span className="inline-block px-3 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-700 capitalize">
                        {transaction.category}
                      </span>
                    </td>
                    <td className={`py-3 px-4 text-right font-medium ${
                      transaction.type === 'income' ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {transaction.type === 'income' ? '+' : '-'}${transaction.amount.toFixed(2)}
                    </td>
                    <td className="py-3 px-4 text-right">
                      <div className="flex justify-end gap-2">
                        <button
                          onClick={() => handleEdit(transaction)}
                          className="p-1 text-blue-600 hover:text-blue-800"
                        >
                          <Edit3 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(transaction.id)}
                          className="p-1 text-red-600 hover:text-red-800"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PersonalFinanceTracker;
