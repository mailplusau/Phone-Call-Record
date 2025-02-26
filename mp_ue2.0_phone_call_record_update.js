/**
 *@NApiVersion 2.x
 *@NScriptType UserEventScript

 * Author:               Ankith Ravindran
 * Created on:           Wed Feb 26 2025
 * Modified on:          Wed Feb 26 2025 10:57:07
 * SuiteScript Version:  2.0 
 * Description:          Get the date & Time format stored in NetSuite to be the local format 
 *
 * Copyright (c) 2025 MailPlus Pty. Ltd.
 */

define([
	"N/record",
	"N/task",
	"N/redirect",
	"N/format",
	"N/currentRecord",
	"SuiteScripts/jQuery Plugins/Moment JS/moment.min",
], function (record, task, redirect, format, currentRecord, moment) {
	var systemAdmin = [3, 1032];

	function beforeSubmit(context) {
		if (context.type == context.UserEventType.EDIT) {
			var phoneCallRecord = context.newRecord;

			var starttime = convertTo24HourFormat(
				phoneCallRecord.getValue({
					fieldId: "starttime",
				})
			);

			var endtime = convertTo24HourFormat(
				phoneCallRecord.getValue({
					fieldId: "endtime",
				})
			);

			log.debug({
				title: "starttime",
				details: starttime,
			});

			log.debug({
				title: "endtime",
				details: endtime,
			});

			// Calculate the difference in minutes between starttime and endtime
			// var startDate = new Date("1970-01-01T" + starttime + ":00");
			// var endDate = new Date("1970-01-01T" + endtime + ":00");
			var diffInMinutes = (endtime - starttime) / (1000 * 60);

			log.debug({
				title: "Difference in minutes",
				details: diffInMinutes,
			});

			// var todaysDateTime = getDateStoreNS();
			// var todaysDateTime = getCurrentDateTime();

			// var todaysDateTimeSplit = todaysDateTime.split(" ");
			// var todaysDate = todaysDateTimeSplit[0];
			// var todaysTime = todaysDateTimeSplit[1];

			log.debug({
				title: "phoneCallRecord",
				details: phoneCallRecord,
			});

			var now = new Date();
			// now.setHours(now.getHours() + 19);
			log.debug({
				title: "now",
				details: now,
			});

			log.debug({
				title: "now.toString()",
				details: now.toString(),
			});

			// now = now.toString();

			// Calculate the Sydney timezone offset (UTC+11 during daylight saving time, UTC+10 otherwise)
			// var sydneyOffset = 11 * 60; // Sydney is UTC+11 during daylight saving time
			// var localOffset = now.getTimezoneOffset(); // Local timezone offset in minutes

			// // Calculate the difference in minutes and adjust the date
			// var offsetDifference = sydneyOffset - localOffset;
			// now.setMinutes(now.getMinutes() + offsetDifference);

			// log.debug({
			// 	title: "now.toString()",
			// 	details: now.toString(),
			// });

			// Format the date to "YYYY-MM-DDTHH:MM:SS"
			now.setHours(now.getHours() + 19);
			var year = now.getFullYear();
			var month = customPadStart((now.getMonth() + 1).toString(), 2, "0"); // Months are zero-based
			var day = customPadStart(now.getDate().toString(), 2, "0");
			var hours = customPadStart(now.getHours().toString(), 2, "0");
			var minutes = customPadStart(now.getMinutes().toString(), 2, "0");
			var seconds = customPadStart(now.getSeconds().toString(), 2, "0");

			var formattedDateTime =
				year +
				"-" +
				month +
				"-" +
				day +
				"T" +
				hours +
				":" +
				minutes +
				":" +
				seconds;

			log.debug({
				title: "sydneyTime",
				details: formattedDateTime,
			});

			var formattedTime = hours + ":" + minutes;
			log.debug({
				title: "formattedTime",
				details: formattedTime,
			});

			var callback_date = month + "/" + day + "/" + year;
			var date = new Date(callback_date);
			format.format({
				value: date,
				type: format.Type.DATE,
				timezone: format.Timezone.AUSTRALIA_SYDNEY,
			});

			var start_arr = formattedTime.split(":");
			var startTimeVar = new Date(callback_date);
			startTimeVar.setHours(start_arr[0], start_arr[1], 0, 0);

			log.debug({
				title: "date",
				details: date,
			});
			log.debug({
				title: "startTimeVar",
				details: startTimeVar,
			});

			phoneCallRecord.setValue({
				fieldId: "startdate",
				value: date,
			});
			phoneCallRecord.setValue({
				fieldId: "completeddate",
				value: date,
			});

			// phoneCallRecord.setValue({
			// 	fieldId: "starttime",
			// 	value: startTimeVar,
			// });

			log.debug({
				title: "phoneCallRecord",
				details: phoneCallRecord,
			});
		}
	}

	// Function to convert time to 24-hour format
	function convertTo24HourFormat(dateStr) {
		var date = new Date(dateStr);
		var hours = customPadStart((date.getUTCHours() + 11).toString(), 2, "0");
		var minutes = customPadStart(date.getUTCMinutes().toString(), 2, "0"); // Create a Date object with the given time
		return hours + ":" + minutes;
	}

	/**
	 * @description
	 * @author Ankith Ravindran (AR)
	 * @date 10/09/2024
	 * @param {*} time24
	 * @returns {*}
	 */
	function convertTo12HourFormat(time24) {
		// Split the time string into hours and minutes
		var [hours, minutes] = time24.split(":").map(Number);

		// Determine AM or PM suffix
		var suffix = hours >= 12 ? "pm" : "am";

		// Convert hours to 12-hour format
		var hours12 = hours % 12 || 12;

		var newMinutes = minutes.toString();
		newMinutes = padStart(newMinutes, 2, "0");

		// Return the formatted 12-hour time string
		return hours12 + ":" + newMinutes + " " + suffix;
	}

	function getDateStoreNS() {
		var date = new Date();
		// if (date.getHours() > 6) {
		//     date.setDate(date.getDate() + 1);
		// }

		format.format({
			value: date,
			type: format.Type.DATETIME,
			timezone: format.Timezone.AUSTRALIA_SYDNEY,
		});

		log.debug({
			title: "date",
			details: date,
		});

		return date;
	}

	// Function to get current date and time in "dd/mm/yyyy HH:MM" format
	function getCurrentDateTime() {
		var now = new Date();
		log.debug({
			title: "now",
			details: now,
		});
		now.setHours(now.getHours() + 11);
		var day = customPadStart(now.getDate().toString(), 1, "0");
		var month = customPadStart((now.getMonth() + 1).toString(), 1, "0"); // Months are zero-based
		var year = now.getFullYear();
		var hours = customPadStart(now.getUTCHours().toString(), 2, "0");
		var minutes = customPadStart(now.getUTCMinutes().toString(), 2, "0");
		return day + "/" + month + "/" + year + " " + hours + ":" + minutes;
	}

	/* @description Pads the current string with another string (multiple times, if needed) until the resulting string reaches the given length. The padding is applied from the start (left) of the current string.
	 * @param {string} str - The original string to pad.
	 * @param {number} targetLength - The length of the resulting string once the current string has been padded.
	 * @param {string} padString - The string to pad the current string with. Defaults to a space if not provided.
	 * @returns {string} The padded string.
	 */
	function customPadStart(str, targetLength, padString) {
		// Convert the input to a string
		str = String(str);

		// If the target length is less than or equal to the string's length, return the original string
		if (str.length >= targetLength) {
			return str;
		}

		// Calculate the length of the padding needed
		var paddingLength = targetLength - str.length;

		// Repeat the padString enough times to cover the padding length
		var repeatedPadString = customRepeat(
			padString,
			Math.ceil(paddingLength / padString.length)
		);

		// Slice the repeated padString to the exact padding length needed and concatenate with the original string
		return repeatedPadString.slice(0, paddingLength) + str;
	}

	/**
	 * @description Repeats the given string a specified number of times.
	 * @param {string} str - The string to repeat.
	 * @param {number} count - The number of times to repeat the string.
	 * @returns {string} The repeated string.
	 */
	function customRepeat(str, count) {
		// Convert the input to a string
		str = String(str);

		// If the count is 0 or less, return an empty string
		if (count <= 0) {
			return "";
		}

		// Initialize the result string
		var result = "";

		// Repeat the string by concatenating it to the result
		for (var i = 0; i < count; i++) {
			result += str;
		}

		return result;
	}

	/**
	 * @description Pads the current string with another string (multiple times, if needed) until the resulting string reaches the given length. The padding is applied from the start (left) of the current string.
	 * @param {string} str - The original string to pad.
	 * @param {number} targetLength - The length of the resulting string once the current string has been padded.
	 * @param {string} padString - The string to pad the current string with. Defaults to a space if not provided.
	 * @returns {string} The padded string.
	 */
	function padStart(str, targetLength, padString) {
		// Convert the input to a string
		str = String(str);

		// If the target length is less than or equal to the string's length, return the original string
		if (str.length >= targetLength) {
			return str;
		}

		// Calculate the length of the padding needed
		var paddingLength = targetLength - str.length;

		// Repeat the padString enough times to cover the padding length
		var repeatedPadString = repeat(
			padString,
			Math.ceil(paddingLength / padString.length)
		);

		// Slice the repeated padString to the exact padding length needed and concatenate with the original string
		return repeatedPadString.slice(0, paddingLength) + str;
	}

	/**
	 * @description Repeats the given string a specified number of times.
	 * @param {string} str - The string to repeat.
	 * @param {number} count - The number of times to repeat the string.
	 * @returns {string} The repeated string.
	 */
	function repeat(str, count) {
		// Convert the input to a string
		str = String(str);

		// If the count is 0, return an empty string
		if (count <= 0) {
			return "";
		}

		// Initialize the result string
		var result = "";

		// Repeat the string by concatenating it to the result
		for (var i = 0; i < count; i++) {
			result += str;
		}

		return result;
	}

	return {
		// beforeLoad: beforeLoad,
		// afterSubmit: afterSubmit,
		beforeSubmit: beforeSubmit,
	};
});
