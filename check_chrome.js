/*
 * Some of this code taken from the "CheckFox" (https://addons.mozilla.org/en-US/firefox/addon/checkfox/) extension by Sean LeBlanc.
 * Under the BSD License (text not in code).
 *
 * THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO,
 * THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT OWNER OR CONTRIBUTORS
 * BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE
 * GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT
 * LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
 */

function qc_getCheckBoxes()
{
	var doc = document;
	var checkBoxes = doc.evaluate("//input[translate(@type, 'ABCDEFGHIJKLMNOPQRSTUVWXYZ', 'abcdefghijklmnopqrstuvwxyz')='checkbox']", doc, null,
	XPathResult.UNORDERED_NODE_SNAPSHOT_TYPE, null);
	console.log("First eval # of checkBoxes: " + checkBoxes.snapshotLength);

	var all = new Array(checkBoxes);

	console.log("About to check # of frames...");

    if (window.frames.length > 0)
	{
	   	console.log("Frames greater than zero: " + window.frames.length);

		for (var i=0; i < window.frames.length; i++)
		{
			console.log("Adding checkboxes from frame #" + i);
			doc = window.frames[i].document;
		    checkBoxes = doc.evaluate("//input[translate(@type, 'ABCDEFGHIJKLMNOPQRSTUVWXYZ', 'abcdefghijklmnopqrstuvwxyz')='checkbox']", doc, null,
		  		XPathResult.UNORDERED_NODE_SNAPSHOT_TYPE, null);

		  	if (checkBoxes.snapshotLength > 0)
			{
		  		console.log("Checkbox snapshotLength=" + checkBoxes.snapshotLength);
		  		all = all.concat(checkBoxes);
		  	}
		}
	}

	return all;
}

function qc_doOnSelection (sel, check, inverse)
{
	var all, aCheckBox, checkBoxes;
	var clickList = new Array();
	all = qc_getCheckBoxes();

	for (var a = 0; a < all.length; a++)
	{
		console.log("Checking all # " + a);
		checkBoxes = all[a];

		for (var i = 0; i < checkBoxes.snapshotLength; i++)
		{
			console.log("Inspecting checkbox # " + i);
			aCheckBox = checkBoxes.snapshotItem(i);
			console.log("Checkbox: " + aCheckBox);

			if (sel.containsNode(aCheckBox, true))
			{
				console.log("Checkbox " + i + " was in selection.");

				if (inverse == true)
					clickList = clickList.concat(aCheckBox);
				else if ((aCheckBox.checked && !check) || (!aCheckBox.checked && check))
					clickList = clickList.concat(aCheckBox);
			}
		}
	}

	for (var i=0; i < clickList.length; i++)
		clickList[i].click();
}


function qc_getSelection()
{
	sel = window.getSelection();

	console.log("Selection len: " + sel.toString().length);

	if (sel.toString().length<=0)
	{
		console.log("No selection found at top level!");
		if (window.frames.length > 0)
		{
			console.log("Checking other frames...");

			for (var i=0; i < window.frames.length; i++)
			{
				console.log("Checking selection on frame #" + i);

				sel = window.frames[i].getSelection();
				if (sel.toString().length>0)
					break;
			}
		}
	}

	return sel;
}

chrome.runtime.onMessage.addListener (
		function(request, sender, sendResponse)
		{
				console.log("Got prompt context menu: " + request.check_to);
				sel = qc_getSelection();

				if (sel.toString().length < 1)
					return;

				var check = false;
				var inverse = false;

				if (request.check_to == 2)
					var check = true;
				else if (request.check_to == 3)
					var inverse = true;

				qc_doOnSelection(sel, check, inverse);

				console.log("Selection len: " + sel.toString().length);
				sendResponse({farewell: "thanks"});
		}
);
