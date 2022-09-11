function getData(id, count, flip) {
	var data = "";
	switch (flip) {
		case 1: data = "|"; break;
		case 2: data = "-"; break;
		case 3: data = "+"; break;
	}
	if (id && count === 1) {
		return data + id.toString(36).toUpperCase();
	}
	while (count > 36) {
		data = data + id.toString(36) + "z";
		count -= 36;
	}
	if (count > 0) {
		count--;
		data = data + id.toString(36) + count.toString(36);
	}
	return data;
}



tiled.registerMapFormat("js13k", {
	name: "js13k format",
	extension: "json",
	write: function(map, fileName) {
		var nav = [];
		var data = "";
		for (var i = map.layerCount - 1; i >= 0 ; i--) {
			var layer = map.layerAt(i);
			if (layer.isObjectLayer) {
				for (var j = 0; j < layer.objectCount; j++) {
					var obj = layer.objectAt(j);
					nav.push(obj.x / map.tileWidth, obj.y / map.tileHeight, obj.width / map.tileWidth, obj.height / map.tileHeight);
				}
			}
			if (layer.isTileLayer) {
				var lastId = 0;
				var lastFlip = 0;
				var count = 0;
				for (var y = 0; y < layer.height; ++y) {
					for (var x = 0; x < layer.width; ++x) {
						var cell = layer.cellAt(x, y);
						var id = cell.empty ? 0 : cell.tileId + 10;
						var flip = 0;
						if (cell.flippedHorizontally) flip += 1;
						if (cell.flippedVertically) flip += 2;
						if (id !== lastId || flip !== lastFlip) {
							if (count > 0) {
								data = data + getData(lastId, count, lastFlip);
								count = 0;
							}
							lastId = id;
							lastFlip = flip;
						}
						count++;
					}
				}
				if (lastId > 0) {
					data = data + getData(lastId, count, lastFlip);
				}
				if (i) data = data + ",";
			}
		}
		var file = new TextFile(fileName, TextFile.WriteOnly);
		data = data.split(",");
		if (nav.length) data.push(nav);
		file.write(JSON.stringify(data));
		file.commit();
	}
});