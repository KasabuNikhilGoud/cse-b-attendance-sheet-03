
import React, { useState } from 'react';
import { Phone, Plus, Trash2 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';

interface NumberSelectorProps {
  onNumbersSelected: (numbers: string[]) => void;
}

const NumberSelector: React.FC<NumberSelectorProps> = ({ onNumbersSelected }) => {
  const [numbers, setNumbers] = useState<string[]>(['+919347464113']);
  const [selectedNumbers, setSelectedNumbers] = useState<string[]>(['+919347464113']);
  const [newNumber, setNewNumber] = useState('');

  const addNumber = () => {
    if (newNumber.trim() && !numbers.includes(newNumber.trim())) {
      const formattedNumber = newNumber.trim().startsWith('+') ? newNumber.trim() : `+91${newNumber.trim()}`;
      setNumbers(prev => [...prev, formattedNumber]);
      setNewNumber('');
    }
  };

  const removeNumber = (numberToRemove: string) => {
    setNumbers(prev => prev.filter(num => num !== numberToRemove));
    setSelectedNumbers(prev => prev.filter(num => num !== numberToRemove));
  };

  const toggleNumberSelection = (number: string, checked: boolean) => {
    if (checked) {
      setSelectedNumbers(prev => [...prev, number]);
    } else {
      setSelectedNumbers(prev => prev.filter(num => num !== number));
    }
  };

  const handleSend = () => {
    onNumbersSelected(selectedNumbers);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Phone className="h-5 w-5" />
          Select WhatsApp Numbers
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Add new number */}
        <div className="flex gap-2">
          <Input
            placeholder="Enter phone number (e.g., 9876543210)"
            value={newNumber}
            onChange={(e) => setNewNumber(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && addNumber()}
          />
          <Button onClick={addNumber} variant="outline" size="sm">
            <Plus className="h-4 w-4" />
          </Button>
        </div>

        {/* Number list */}
        <div className="space-y-2 max-h-40 overflow-y-auto">
          {numbers.map(number => (
            <div key={number} className="flex items-center justify-between p-2 bg-gray-50 rounded">
              <div className="flex items-center gap-2">
                <Checkbox
                  checked={selectedNumbers.includes(number)}
                  onCheckedChange={(checked) => toggleNumberSelection(number, checked as boolean)}
                />
                <span className="font-mono text-sm">{number}</span>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => removeNumber(number)}
                className="text-red-600 hover:text-red-700"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          ))}
        </div>

        {/* Send button */}
        <Button 
          onClick={handleSend}
          disabled={selectedNumbers.length === 0}
          className="w-full"
        >
          Send to {selectedNumbers.length} number{selectedNumbers.length !== 1 ? 's' : ''}
        </Button>
      </CardContent>
    </Card>
  );
};

export default NumberSelector;
