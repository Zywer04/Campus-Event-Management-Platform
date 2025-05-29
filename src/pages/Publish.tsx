import React, { useState } from 'react';
import * as echarts from 'echarts';

const Publish: React.FC = () => {
  const [formData, setFormData] = useState({
    title: '',
    coverImage: null,
    type: '',
    startTime: '',
    endTime: '',
    location: '',
    details: '',
    maxParticipants: '',
    registrationDeadline: ''
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [previewImage, setPreviewImage] = useState<string>('');

  const activityTypes = [
    { id: 'academic', name: '学术讲座' },
    { id: 'sports', name: '文体活动' },
    { id: 'culture', name: '文化艺术' },
    { id: 'career', name: '职业发展' },
    { id: 'other', name: '其他' }
  ];

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.title.trim()) {
      newErrors.title = '请输入活动标题';
    }
    if (!formData.coverImage) {
      newErrors.coverImage = '请上传活动封面';
    }
    if (!formData.type) {
      newErrors.type = '请选择活动类型';
    }
    if (!formData.startTime) {
      newErrors.startTime = '请选择开始时间';
    }
    if (!formData.endTime) {
      newErrors.endTime = '请选择结束时间';
    }
    if (!formData.location.trim()) {
      newErrors.location = '请输入活动地点';
    }
    if (!formData.details.trim()) {
      newErrors.details = '请输入活动详情';
    }
    if (!formData.maxParticipants) {
      newErrors.maxParticipants = '请输入人数上限';
    }
    if (!formData.registrationDeadline) {
      newErrors.registrationDeadline = '请选择报名截止时间';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setFormData({ ...formData, coverImage: file });
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (isDraft: boolean) => {
    if (!isDraft && !validateForm()) {
      return;
    }
    // 处理表单提交逻辑
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* 顶部导航 */}
      <nav className="fixed top-0 left-0 right-0 h-16 bg-white shadow-sm z-50">
        <div className="max-w-[1440px] mx-auto px-6 h-full flex items-center">
          <a
            href="https://readdy.ai/home/b0cf731b-de36-44f8-8c9f-e57d09ede402/446a40e3-0c00-4354-93ed-34b1ad9576e3"
            data-readdy="true"
            className="flex items-center text-gray-600 hover:text-purple-600"
          >
            <i className="fas fa-arrow-left mr-3"></i>
            <span>返回</span>
          </a>
          <h1 className="text-lg font-semibold ml-6">发布活动</h1>
        </div>
      </nav>

      {/* 主内容区 */}
      <main className="pt-24 pb-32 px-6">
        <div className="max-w-3xl mx-auto bg-white rounded-xl shadow-sm p-8">
          <form className="space-y-8">
            {/* 活动标题 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                活动标题 <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="w-full px-4 py-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                placeholder="请输入活动标题"
              />
              {errors.title && <p className="mt-1 text-sm text-red-500">{errors.title}</p>}
            </div>

            {/* 活动封面 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                活动封面 <span className="text-red-500">*</span>
              </label>
              <div className="mt-2">
                <div className="flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer hover:border-purple-500">
                  <div className="space-y-1 text-center">
                    {previewImage ? (
                      <img src={previewImage} alt="预览" className="mx-auto h-32 w-auto" />
                    ) : (
                      <i className="fas fa-cloud-upload-alt text-gray-400 text-3xl mb-3"></i>
                    )}
                    <div className="flex text-sm text-gray-600">
                      <label htmlFor="file-upload" className="relative cursor-pointer bg-white rounded-md font-medium text-purple-600 hover:text-purple-500">
                        <span>上传图片</span>
                        <input
                          id="file-upload"
                          name="file-upload"
                          type="file"
                          className="sr-only"
                          accept="image/*"
                          onChange={handleImageUpload}
                        />
                      </label>
                      <p className="pl-1">或拖放图片到此处</p>
                    </div>
                    <p className="text-xs text-gray-500">PNG, JPG, GIF 格式</p>
                  </div>
                </div>
              </div>
              {errors.coverImage && <p className="mt-1 text-sm text-red-500">{errors.coverImage}</p>}
            </div>

            {/* 活动类型 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                活动类型 <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <select
                  value={formData.type}
                  onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                  className="w-full px-4 py-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent appearance-none"
                >
                  <option value="">请选择活动类型</option>
                  {activityTypes.map((type) => (
                    <option key={type.id} value={type.id}>
                      {type.name}
                    </option>
                  ))}
                </select>
                <i className="fas fa-chevron-down absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"></i>
              </div>
              {errors.type && <p className="mt-1 text-sm text-red-500">{errors.type}</p>}
            </div>

            {/* 活动时间 */}
            <div className="grid grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  开始时间 <span className="text-red-500">*</span>
                </label>
                <input
                  type="datetime-local"
                  value={formData.startTime}
                  onChange={(e) => setFormData({ ...formData, startTime: e.target.value })}
                  className="w-full px-4 py-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
                {errors.startTime && <p className="mt-1 text-sm text-red-500">{errors.startTime}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  结束时间 <span className="text-red-500">*</span>
                </label>
                <input
                  type="datetime-local"
                  value={formData.endTime}
                  onChange={(e) => setFormData({ ...formData, endTime: e.target.value })}
                  className="w-full px-4 py-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
                {errors.endTime && <p className="mt-1 text-sm text-red-500">{errors.endTime}</p>}
              </div>
            </div>

            {/* 活动地点 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                活动地点 <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                className="w-full px-4 py-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                placeholder="请输入活动地点"
              />
              {errors.location && <p className="mt-1 text-sm text-red-500">{errors.location}</p>}
            </div>

            {/* 活动详情 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                活动详情 <span className="text-red-500">*</span>
              </label>
              <textarea
                value={formData.details}
                onChange={(e) => setFormData({ ...formData, details: e.target.value })}
                rows={6}
                className="w-full px-4 py-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                placeholder="请输入活动详情描述"
              ></textarea>
              {errors.details && <p className="mt-1 text-sm text-red-500">{errors.details}</p>}
            </div>

            {/* 报名人数上限 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                报名人数上限 <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                min="1"
                value={formData.maxParticipants}
                onChange={(e) => setFormData({ ...formData, maxParticipants: e.target.value })}
                className="w-full px-4 py-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                placeholder="请输入人数上限"
              />
              {errors.maxParticipants && <p className="mt-1 text-sm text-red-500">{errors.maxParticipants}</p>}
            </div>

            {/* 报名截止时间 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                报名截止时间 <span className="text-red-500">*</span>
              </label>
              <input
                type="datetime-local"
                value={formData.registrationDeadline}
                onChange={(e) => setFormData({ ...formData, registrationDeadline: e.target.value })}
                className="w-full px-4 py-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
              {errors.registrationDeadline && <p className="mt-1 text-sm text-red-500">{errors.registrationDeadline}</p>}
            </div>
          </form>
        </div>
      </main>

      {/* 底部操作栏 */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200">
        <div className="max-w-3xl mx-auto px-6 py-4 flex justify-between">
          <button
            onClick={() => handleSubmit(true)}
            className="px-6 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors cursor-pointer whitespace-nowrap !rounded-button"
          >
            保存草稿
          </button>
          <button
            onClick={() => handleSubmit(false)}
            className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors cursor-pointer whitespace-nowrap !rounded-button"
          >
            发布活动
          </button>
        </div>
      </div>
    </div>
  );
};

export default Publish;