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

			var phonecallSubject = phoneCallRecord.getValue({
				fieldId: "title",
			});

			if (phonecallSubject.indexOf("Call with") === 0) {
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

				var now = new Date();

				// Format the date to "YYYY-MM-DDTHH:MM:SS"
				now.setHours(now.getHours() + 19);
				var year = now.getFullYear();
				var month = customPadStart((now.getMonth() + 1).toString(), 2, "0"); // Months are zero-based
				var day = customPadStart(now.getDate().toString(), 2, "0");
				var hours = customPadStart(now.getHours().toString(), 2, "0");
				var minutes = customPadStart(now.getMinutes().toString(), 2, "0");
				var seconds = customPadStart(now.getSeconds().toString(), 2, "0");

				var formattedTime = hours + ":" + minutes;

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

				var oldStartTime = starttime.split(":");
				var oldStartTimeVar = new Date(callback_date);
				oldStartTimeVar.setHours(oldStartTime[0], oldStartTime[1], 0, 0);

				var oldEndTime = endtime.split(":");
				var oldEndTimeVar = new Date(callback_date);
				oldEndTimeVar.setHours(oldEndTime[0], oldEndTime[1], 0, 0);

				var diffInMinutes = (oldEndTimeVar - oldStartTimeVar) / (1000 * 60);

				var endTimeVar = new Date(callback_date);
				endTimeVar.setHours(start_arr[0], start_arr[1], 0, 0);
				endTimeVar.setMinutes(endTimeVar.getMinutes() + diffInMinutes);

				phoneCallRecord.setValue({
					fieldId: "startdate",
					value: date,
				});
				phoneCallRecord.setValue({
					fieldId: "completeddate",
					value: date,
				});

				phoneCallRecord.setValue({
					fieldId: "starttime",
					value: startTimeVar,
				});

				phoneCallRecord.setValue({
					fieldId: "endtime",
					value: endTimeVar,
				});
			}
		}
	}

	// Function to convert time to 24-hour format
	function convertTo24HourFormat(dateStr) {
		var date = new Date(dateStr);
		var hours = customPadStart((date.getUTCHours() + 11).toString(), 2, "0");
		var minutes = customPadStart(date.getUTCMinutes().toString(), 2, "0"); // Create a Date object with the given time
		return hours + ":" + minutes;
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
