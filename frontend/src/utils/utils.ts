import { parse, format } from 'date-fns';
import { zhCN } from 'date-fns/locale';

/**
 * 格式化日期时间
 * @param dateString 日期字符串
 * @param formatStr 输出格式
 * @returns 格式化后的日期字符串
 */
export function formatDate(dateString: string | Date | undefined, formatStr = 'yyyy-MM-dd HH:mm') {
  if (!dateString) return '';
  const date = typeof dateString === 'string' ? new Date(dateString) : dateString;
  return format(date, formatStr, { locale: zhCN });
}

/**
 * 格式化时间范围为字符串
 * @param startTime 开始时间
 * @param endTime 结束时间
 * @returns 格式化后的时间范围
 */
export function formatTimeRange(startTime?: string | Date, endTime?: string | Date): string {
  if (!startTime && !endTime) return '未设置时间';
  if (startTime && !endTime) return `${formatDate(startTime)} 开始`;
  if (!startTime && endTime) return `${formatDate(endTime)} 结束`;
  return `${formatDate(startTime)} 至 ${formatDate(endTime)}`;
}

/**
 * 将分数格式化为指定小数位数的字符串
 * @param score 分数
 * @param decimals 小数位数
 * @returns 格式化后的分数字符串
 */
export function formatScore(score?: number, decimals = 2): string {
  if (score === undefined || score === null) return '-';
  return score.toFixed(decimals);
}

/**
 * 根据数值范围获取对应的颜色
 * @param value 数值
 * @param max 最大值
 * @returns 对应的颜色
 */
export function getScoreColor(value: number, max = 10): string {
  if (value >= max * 0.8) return '#52c41a'; // 绿色
  if (value >= max * 0.6) return '#1890ff'; // 蓝色
  if (value >= max * 0.4) return '#faad14'; // 黄色
  return '#f5222d'; // 红色
}

/**
 * 将对象的键值对转换为查询字符串
 * @param params 参数对象
 * @returns 查询字符串
 */
export function objectToQueryString(params: Record<string, any>): string {
  return Object.keys(params)
    .filter(key => params[key] !== undefined && params[key] !== null && params[key] !== '')
    .map(key => `${encodeURIComponent(key)}=${encodeURIComponent(params[key])}`)
    .join('&');
}

/**
 * 获取文件的扩展名
 * @param filename 文件名
 * @returns 扩展名
 */
export function getFileExtension(filename: string): string {
  return filename.slice(((filename.lastIndexOf('.') - 1) >>> 0) + 2);
}

/**
 * 将数字或字符串转换为数字，如果转换失败则返回默认值
 * @param value 要转换的值
 * @param defaultValue 默认值
 * @returns 转换后的数字
 */
export function toNumber(value: any, defaultValue = 0): number {
  const num = Number(value);
  return isNaN(num) ? defaultValue : num;
}

/**
 * 生成指定范围内的随机整数
 * @param min 最小值
 * @param max 最大值
 * @returns 随机整数
 */
export function getRandomInt(min: number, max: number): number {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
} 