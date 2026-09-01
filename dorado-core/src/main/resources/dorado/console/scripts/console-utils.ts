// @ts-nocheck
/// <reference path="../../scripts/dorado/globals.d.ts" />

dorado.console = {};
/**
 * Dorado 控制台辅助 Alex Tong (mailto:alex.tong@bstek.com)
 */
dorado.console.util = {
	formatFileSize: function(value: number): string {
		function _format(val: number, unit: string): string {
			return (val.toFixed(1) + ' ' + unit).replace('.0', '');
		}

		const K: number = 1024, M: number = K * K, G: number = M * K, T: number = G * K;
		const dividers: number[] = [T, G, M, K, 1], units: string[] = ['TB', 'GB', 'MB', 'KB', 'B'];
		if (value === 0) {
			return '0B';
		} else if (value < 0) {
			return 'Invalid size';
		}

		let result: string = '', temp: number = 0;
		for (let i: number = 0; i < dividers.length; i++) {
			const divider: number = dividers[i];
			if (value >= divider) {
				temp = value / divider;
				if (temp < 1.05) {
					result = _format(value,
						units[((i + 1) < units.length) ? (i + 1) : i]);
				} else {
					result = _format(temp, units[i]);
				}
				break;
			}
		}
		return result;
	},
	formatDate: function(date: Date, fmt: string): string {
		const o: { [key: string]: number } = {
			"M+": date.getMonth() + 1,
			"d+": date.getDate(),
			"h+": date.getHours(),
			"m+": date.getMinutes(),
			"s+": date.getSeconds(),
			"q+": Math.floor((date.getMonth() + 3) / 3),
			"S": date.getMilliseconds()
		};
		if (/(y+)/.test(fmt))
			fmt = fmt.replace(RegExp.$1, (date.getFullYear() + "")
				.substr(4 - RegExp.$1.length));
		for (let k in o)
			if (new RegExp("(" + k + ")").test(fmt))
				fmt = fmt.replace(RegExp.$1, (RegExp.$1.length === 1) ? (o[k])
					: (("00" + o[k]).substr(("" + o[k]).length)));
		return fmt;
	},
	formatTime: function(time: string | number | Date): string {
		const format: string = "yyyy-MM-dd hh:mm:ss.S";
		return this.formatDate(new Date(time), format);
	},
	formatTimeLength: function(time: number): string {
		time = Math.round(time);
		let tmpTime: number = Math.floor(time / 1000), h: number, m: number, s: number, sf: number, value: string;
		h = Math.floor(tmpTime / 3600);
		m = Math.floor((tmpTime % 3600) / 60);
		s = Math.floor((tmpTime % 3600 % 60));
		sf = (time - h * 60 * 60 * 1000 - m * 60 * 1000 - s * 1000) / 1000;
		value = h > 0 ? h + 'h' + m + 'm' : '';
		value = h <= 0 && m > 0 ? m + 'm' : '';
		value = value + (s + sf) + 's';
		return value;
	},
	avg: function(nums: number[]): string {
		let sum: number = 0;
		for (let i: number = 0; i < nums.length; i++) {
			sum += nums[i];
		}
		let value: string = (nums.length === 0 ? '0' : sum / nums.length) + '';
		return value.indexOf(".") > 0 ? value.substring(0, value.indexOf("."))
			: value;
	},
	percent: function(num: number, total: number): string {
		num = parseFloat(num as any);
		total = parseFloat(total as any);
		if (isNaN(num) || isNaN(total)) {
			return "-";
		}
		return total <= 0 ? "0%"
			: (Math.round(num / total * 10000) / 100.00 + "%");
	}
};


/**
 * 解决小数科学计数法的问题
 */
declare global {
	interface String {
		expandExponential(): string;
	}
}

(String.prototype as any).expandExponential = function(): string {
	return this
		.replace(
			/^([+-])?(\d+).?(\d*)[eE]([-+]?\d+)$/,
			function(x: string, s: string, n: string, f: string, c: string): string {
				let l: boolean = +c < 0, i: number = n.length + +c, x: number = (l ? n : f).length,
					c: number = ((c = Math.abs(+c)) >= x ? c - x + (l ? 1 : 0) : 0),
					z: string = (new Array(c + 1)).join("0"), r: string = n + f;
				return (s || "")
					+ (l ? (r = z + r) : (r += z)).substr(0,
						i += l ? z.length : 0)
					+ (i < r.length ? "." + r.substr(i) : "");
			});
};
/** @Global */
function parseString(value: any): string {
	if (value == null) {
		return "";
	}
	if (typeof value === "number") {
		return value.toString().expandExponential();
	}
	return value.toString();
}
/**
 * 解决小数科学计数法的问题，重写解析string的方法
 */
declare global {
	interface Number {
		old_toString(radix?: number): string;
	}
}

(Number.prototype as any).old_toString = Number.prototype.toString;
(Number.prototype as any).toString = function(radix?: number): string {
	return this.old_toString().expandExponential();
};
