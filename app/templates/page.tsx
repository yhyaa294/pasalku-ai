'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  FileText,
  Search,
  Filter,
  Download,
  Eye,
  Edit,
  Check,
  AlertCircle,
  BookOpen,
  FileCheck,
  FileSignature,
  Building,
  Home,
  Briefcase,
  Shield,
  Clock,
  Users,
  TrendingUp
} from 'lucide-react';

interface Template {
  template_id: string;
  name: string;
  category: string;
  description: string;
  tags: string[];
  estimated_complexity: string;
  usage_count?: number;
  last_updated: string;
}

interface TemplateVariable {
  variable_name: string;
  variable_type: string;
  label: string;
  description: string;
  required: boolean;
  choices?: string[];
  default_value?: any;
}

const TemplatesPage = () => {
  const [templates, setTemplates] = useState<Template[]>([]);
  const [categories, setCategories] = useState<any>({});
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTemplate, setSelectedTemplate] = useState<Template | null>(null);
  const [templateVariables, setTemplateVariables] = useState<TemplateVariable[]>([]);
  const [variableValues, setVariableValues] = useState<{[key: string]: any}>({});
  const [preview, setPreview] = useState<string>('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedDoc, setGeneratedDoc] = useState<any>(null);
  const router = useRouter();

  const categoryIcons: {[key: string]: any} = {
    contracts: FileSignature,
    power_of_attorney: Shield,
    agreements: FileCheck,
    legal_notices: AlertCircle,
    company_documents: Building,
    property_documents: Home,
    employment: Briefcase,
    courts: Shield
  };

  const complexityColors = {
    simple: 'bg-green-100 text-green-800',
    medium: 'bg-yellow-100 text-yellow-800',
    complex: 'bg-red-100 text-red-800'
  };

  useEffect(() => {
    fetchTemplates();
    fetchCategories();
  }, []);

  useEffect(() => {
    if (selectedTemplate) {
      fetchTemplateVariables(selectedTemplate.template_id);
    }
  }, [selectedTemplate]);

  const fetchTemplates = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('/api/templates/', {
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (response.ok) {
        const data = await response.json();
        setTemplates(data);
      }
    } catch (error) {
      console.error('Error fetching templates:', error);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await fetch('/api/templates/categories');
      if (response.ok) {
        const data = await response.json();
        setCategories(data.categories);
      }
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  const fetchTemplateVariables = async (templateId: string) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`/api/templates/${templateId}/variables`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (response.ok) {
        const variables = await response.json();
        setTemplateVariables(variables);

        // Initialize default values
        const defaults: {[key: string]: any} = {};
        variables.forEach((variable: TemplateVariable) => {
          defaults[variable.variable_name] = variable.default_value || '';
        });
        setVariableValues(defaults);
      }
    } catch (error) {
      console.error('Error fetching template variables:', error);
    }
  };

  const generatePreview = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('/api/templates/preview', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          template_id: selectedTemplate!.template_id,
          variables: variableValues,
          format: 'html'
        })
      });

      if (response.ok) {
        const data = await response.json();
        setPreview(data.html_content);
      }
    } catch (error) {
      console.error('Error generating preview:', error);
    }
  };

  const generateDocument = async (format: 'pdf' | 'docx' | 'html') => {
    setIsGenerating(true);
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('/api/templates/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          template_id: selectedTemplate!.template_id,
          variables: variableValues,
          format: format,
          language: 'indonesian'
        })
      });

      if (response.ok) {
        const data = await response.json();
        setGeneratedDoc(data);
      }
    } catch (error) {
      console.error('Error generating document:', error);
    } finally {
      setIsGenerating(false);
    }
  };

  const filteredTemplates = templates.filter(template => {
    const matchesCategory = selectedCategory === 'all' || template.category === selectedCategory;
    const matchesSearch = template.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         template.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         template.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  if (selectedTemplate) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-6">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => {
                  setSelectedTemplate(null);
                  setTemplateVariables([]);
                  setVariableValues({});
                  setPreview('');
                  setGeneratedDoc(null);
                }}
                className="p-2 rounded-full hover:bg-white/10 transition-colors"
              >
                ←
              </button>
              <div>
                <h1 className="text-2xl font-bold">{selectedTemplate.name}</h1>
                <p className="text-blue-100">{selectedTemplate.description}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Variable Form */}
            <div className="space-y-6">
              <div className="bg-white rounded-xl shadow-lg p-6">
                <h2 className="text-xl font-semibold mb-6 flex items-center">
                  <Edit className="w-6 h-6 mr-2 text-blue-600" />
                  Customize Template
                </h2>

                <div className="space-y-4">
                  {templateVariables.map((variable) => (
                    <div key={variable.variable_name} className="space-y-2">
                      <label className="block text-sm font-medium text-gray-700">
                        {variable.label}
                        {variable.required && <span className="text-red-500">*</span>}
                      </label>

                      {variable.variable_type === 'text' && (
                        <input
                          type="text"
                          value={variableValues[variable.variable_name] || ''}
                          onChange={(e) => setVariableValues({
                            ...variableValues,
                            [variable.variable_name]: e.target.value
                          })}
                          placeholder={variable.description}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                      )}

                      {variable.variable_type === 'date' && (
                        <input
                          type="date"
                          value={variableValues[variable.variable_name] || ''}
                          onChange={(e) => setVariableValues({
                            ...variableValues,
                            [variable.variable_name]: e.target.value
                          })}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                      )}

                      {variable.variable_type === 'number' && (
                        <input
                          type="number"
                          value={variableValues[variable.variable_name] || ''}
                          onChange={(e) => setVariableValues({
                            ...variableValues,
                            [variable.variable_name]: e.target.value
                          })}
                          placeholder={variable.description}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                      )}

                      {variable.variable_type === 'choice' && variable.choices && (
                        <select
                          value={variableValues[variable.variable_name] || ''}
                          onChange={(e) => setVariableValues({
                            ...variableValues,
                            [variable.variable_name]: e.target.value
                          })}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        >
                          <option value="">-- Pilih {variable.label} --</option>
                          {variable.choices.map((choice) => (
                            <option key={choice} value={choice}>{choice}</option>
                          ))}
                        </select>
                      )}

                      <p className="text-xs text-gray-500">{variable.description}</p>
                    </div>
                  ))}
                </div>

                <div className="mt-6 flex space-x-3">
                  <button
                    onClick={generatePreview}
                    className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    <Eye className="w-4 h-4 mr-2" />
                    Preview
                  </button>
                  <button
                    onClick={() => generateDocument('pdf')}
                    disabled={isGenerating}
                    className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    <Download className="w-4 h-4 mr-2" />
                    {isGenerating ? 'Generating...' : 'Generate PDF'}
                  </button>
                  <button
                    onClick={() => generateDocument('docx')}
                    disabled={isGenerating}
                    className="flex items-center px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    <FileText className="w-4 h-4 mr-2" />
                    Generate DOCX
                  </button>
                </div>
              </div>
            </div>

            {/* Preview/Output Panel */}
            <div className="space-y-6">
              {preview && (
                <div className="bg-white rounded-xl shadow-lg p-6">
                  <h2 className="text-xl font-semibold mb-4 flex items-center">
                    <Eye className="w-6 h-6 mr-2 text-green-600" />
                    Document Preview
                  </h2>
                  <div
                    className="bg-gray-50 p-4 rounded border max-h-96 overflow-y-auto text-sm"
                    dangerouslySetInnerHTML={{ __html: preview }}
                  />
                </div>
              )}

              {generatedDoc && (
                <div className="bg-white rounded-xl shadow-lg p-6">
                  <h2 className="text-xl font-semibold mb-4 flex items-center">
                    <Check className="w-6 h-6 mr-2 text-green-600" />
                    Document Generated
                  </h2>

                  <div className="space-y-4">
                    <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                      <h3 className="font-medium text-green-800 mb-2">{generatedDoc.filename}</h3>
                      <p className="text-sm text-green-700 mb-3">
                        Document berhasil dibuat dan siap untuk didownload.
                      </p>

                      <button className="w-full px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
                        Download Document
                      </button>
                    </div>

                    <div className="text-xs text-gray-500">
                      Generated at: {new Date(generatedDoc.generated_at).toLocaleString('id-ID')}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl font-bold mb-4 flex items-center justify-center">
              <FileText className="w-10 h-10 mr-4" />
              AI Document Generator
            </h1>
            <p className="text-xl opacity-90 max-w-3xl mx-auto">
              Generate dokumen hukum profesional dengan AI. Template siap pakai dengan custom variables dan preview real-time.
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Filter Bar */}
        <div className="mb-8 flex flex-col sm:flex-row gap-4 justify-between items-center">
          <div className="flex items-center space-x-4">
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search templates..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="all">All Categories</option>
              {Object.entries(categories).map(([key, category]: [string, any]) => (
                <option key={key} value={key}>{category.name}</option>
              ))}
            </select>
          </div>

          <div className="flex items-center space-x-2 text-sm text-gray-600">
            <span>{filteredTemplates.length} template{filteredTemplates.length !== 1 ? 's' : ''} found</span>
          </div>
        </div>

        {/* Templates Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {filteredTemplates.map((template) => {
            const CategoryIcon = categoryIcons[template.category] || FileText;

            return (
              <div
                key={template.template_id}
                onClick={() => setSelectedTemplate(template)}
                className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all cursor-pointer border border-gray-100 hover:border-blue-200 p-6"
              >
                <div className="flex items-start justify-between mb-4">
                  <CategoryIcon className="w-8 h-8 text-blue-600" />
                  <span className={`text-xs px-2 py-1 rounded-full ${
                    complexityColors[template.estimated_complexity as keyof typeof complexityColors]
                  }`}>
                    {template.estimated_complexity}
                  </span>
                </div>

                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  {template.name}
                </h3>

                <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                  {template.description}
                </p>

                <div className="flex flex-wrap gap-1 mb-4">
                  {template.tags.slice(0, 3).map((tag) => (
                    <span
                      key={tag}
                      className="text-xs px-2 py-1 bg-blue-100 text-blue-700 rounded-full"
                    >
                      {tag}
                    </span>
                  ))}
                  {template.tags.length > 3 && (
                    <span className="text-xs px-2 py-1 bg-gray-100 text-gray-600 rounded-full">
                      +{template.tags.length - 3} more
                    </span>
                  )}
                </div>

                <div className="flex items-center justify-between text-sm text-gray-500">
                  <span>Used {template.usage_count || 0} times</span>
                  <span>Last updated {new Date(template.last_updated).toLocaleDateString('id-ID')}</span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Popular Templates Section */}
        <div className="bg-white rounded-xl shadow-lg p-8">
          <h2 className="text-2xl font-bold mb-6 flex items-center">
            <TrendingUp className="w-8 h-8 mr-3 text-blind-600" />
            Most Popular Templates
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {templates.slice(0, 4).map((template, index) => (
              <div
                key={template.template_id}
                onClick={() => setSelectedTemplate(template)}
                className="border border-gray-200 rounded-lg p-6 hover:border-blue-300 hover:shadow-md transition-all cursor-pointer"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <div className="flex items-center mb-2">
                      <span className="bg-blue-600 text-white text-xs font-bold px-2 py-1 rounded mr-2">
                        #{index + 1}
                      </span>
                      <h3 className="font-medium text-gray-900">{template.name}</h3>
                    </div>
                    <p className="text-sm text-gray-600 line-clamp-2">
                      {template.description}
                    </p>
                  </div>
                </div>

                <div className="flex items-center justify-between mt-4">
                  <span className="text-xs text-gray-500">
                    {template.usage_count || 0} downloads
                  </span>
                  <div className={`text-xs px-2 py-1 rounded-full ${
                    complexityColors[template.estimated_complexity as keyof typeof complexityColors]
                  }`}>
                    {template.estimated_complexity}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TemplatesPage;