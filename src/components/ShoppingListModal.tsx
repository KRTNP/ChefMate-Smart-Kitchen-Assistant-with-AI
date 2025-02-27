import React from 'react';
import { X, Printer, Download, ShoppingBag } from 'lucide-react';
import { ShoppingListItem } from '../lib/mealPlanner';

interface ShoppingListModalProps {
  shoppingList: ShoppingListItem[];
  onClose: () => void;
}

const ShoppingListModal: React.FC<ShoppingListModalProps> = ({ shoppingList, onClose }) => {
  const categories = Array.from(new Set(shoppingList.map(item => item.category)));
  
  const handlePrint = () => {
    window.print();
  };
  
  const handleDownload = () => {
    // Create a text version of the shopping list
    let content = "SHOPPING LIST\n\n";
    
    categories.forEach(category => {
      content += `${category.toUpperCase()}\n`;
      const categoryItems = shoppingList.filter(item => item.category === category);
      
      categoryItems.forEach(item => {
        content += `- ${item.amount} ${item.unit} ${item.item} (${item.recipes.join(', ')})\n`;
      });
      
      content += "\n";
    });
    
    // Create a download link
    const element = document.createElement('a');
    const file = new Blob([content], {type: 'text/plain'});
    element.href = URL.createObjectURL(file);
    element.download = 'shopping-list.txt';
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-hidden">
        <div className="p-4 bg-emerald-600 text-white flex justify-between items-center">
          <div className="flex items-center gap-2">
            <ShoppingBag className="h-5 w-5" />
            <h2 className="text-xl font-semibold">Shopping List</h2>
          </div>
          <button onClick={onClose} className="text-white hover:text-gray-200">
            <X className="h-6 w-6" />
          </button>
        </div>
        
        <div className="p-4 border-b flex justify-end space-x-4">
          <button 
            onClick={handlePrint}
            className="flex items-center gap-2 px-4 py-2 border rounded-lg hover:bg-gray-50"
          >
            <Printer className="h-4 w-4" />
            <span>Print</span>
          </button>
          <button 
            onClick={handleDownload}
            className="flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700"
          >
            <Download className="h-4 w-4" />
            <span>Download</span>
          </button>
        </div>
        
        <div className="overflow-y-auto p-6" style={{ maxHeight: 'calc(90vh - 130px)' }}>
          {shoppingList.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-600">No items in shopping list.</p>
            </div>
          ) : (
            <div className="space-y-8">
              {categories.map(category => {
                const categoryItems = shoppingList.filter(item => item.category === category);
                return (
                  <div key={category}>
                    <h3 className="text-lg font-semibold mb-3 capitalize">{category}</h3>
                    <ul className="space-y-2">
                      {categoryItems.map((item, index) => (
                        <li key={index} className="flex items-start">
                          <div className="flex-1">
                            <div className="flex items-baseline">
                              <span className="font-medium">{item.amount} {item.unit} {item.item}</span>
                            </div>
                            <p className="text-sm text-gray-500">
                              Used in: {item.recipes.join(', ')}
                            </p>
                          </div>
                        </li>
                      ))}
                    </ul>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ShoppingListModal;