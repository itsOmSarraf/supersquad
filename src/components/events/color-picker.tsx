// src/components/events/color-picker.tsx
import React from 'react';
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";

interface ColorPickerProps {
    value: {
        type: 'solid' | 'gradient';
        colors: string[];
    };
    onChange: (value: { type: 'solid' | 'gradient'; colors: string[] }) => void;
}

const DEFAULT_COLORS = [
    '#FF5733', '#33FF57', '#3357FF', '#F033FF',
    '#FF3333', '#33FFF3', '#FFB533', '#7A33FF'
];

const PRESET_GRADIENTS = [
    ['#FF5733', '#33FF57'],
    ['#3357FF', '#F033FF'],
    ['#FF3333', '#33FFF3'],
    ['#FFB533', '#7A33FF'],
];

export function ColorPicker({ value, onChange }: ColorPickerProps) {
    return (
        <Popover>
            <PopoverTrigger asChild>
                <Button
                    variant="outline"
                    className="w-[240px] justify-start"
                >
                    <div className="w-4 h-4 rounded mr-2"
                        style={{
                            background: value.type === 'solid'
                                ? value.colors[0]
                                : `linear-gradient(to right, ${value.colors.join(', ')})`
                        }}
                    />
                    {value.type === 'solid' ? 'Solid Color' : 'Gradient'}
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-64">
                <Tabs defaultValue="solid" onValueChange={(tab) => {
                    onChange({
                        type: tab as 'solid' | 'gradient',
                        colors: tab === 'solid' ? [value.colors[0] || '#FF5733'] : value.colors.length >= 2 ? value.colors : ['#FF5733', '#33FF57']
                    })
                }}>
                    <TabsList className="w-full">
                        <TabsTrigger value="solid" className="flex-1">Solid</TabsTrigger>
                        <TabsTrigger value="gradient" className="flex-1">Gradient</TabsTrigger>
                    </TabsList>

                    <TabsContent value="solid" className="space-y-4">
                        <div className="grid grid-cols-4 gap-2">
                            {DEFAULT_COLORS.map((color) => (
                                <button
                                    key={color}
                                    className={cn(
                                        "w-8 h-8 rounded-full border-2",
                                        value.colors[0] === color ? "border-black" : "border-transparent"
                                    )}
                                    style={{ backgroundColor: color }}
                                    onClick={() => onChange({ type: 'solid', colors: [color] })}
                                />
                            ))}
                        </div>
                        <div className="flex items-center space-x-2">
                            <Label>Custom</Label>
                            <Input
                                type="color"
                                value={value.colors[0]}
                                onChange={(e) => onChange({ type: 'solid', colors: [e.target.value] })}
                            />
                        </div>
                    </TabsContent>

                    <TabsContent value="gradient" className="space-y-4">
                        <div className="grid grid-cols-2 gap-2">
                            {PRESET_GRADIENTS.map((colors, idx) => (
                                <button
                                    key={idx}
                                    className={cn(
                                        "w-full h-8 rounded",
                                        JSON.stringify(value.colors) === JSON.stringify(colors) ? "ring-2 ring-black" : ""
                                    )}
                                    style={{
                                        background: `linear-gradient(to right, ${colors.join(', ')})`
                                    }}
                                    onClick={() => onChange({ type: 'gradient', colors })}
                                />
                            ))}
                        </div>
                        <div className="space-y-2">
                            <Label>Custom Gradient</Label>
                            <div className="flex space-x-2">
                                <Input
                                    type="color"
                                    value={value.colors[0] || '#FF5733'}
                                    onChange={(e) => onChange({
                                        type: 'gradient',
                                        colors: [e.target.value, value.colors[1] || '#33FF57']
                                    })}
                                />
                                <Input
                                    type="color"
                                    value={value.colors[1] || '#33FF57'}
                                    onChange={(e) => onChange({
                                        type: 'gradient',
                                        colors: [value.colors[0] || '#FF5733', e.target.value]
                                    })}
                                />
                            </div>
                        </div>
                    </TabsContent>
                </Tabs>
            </PopoverContent>
        </Popover>
    );
}