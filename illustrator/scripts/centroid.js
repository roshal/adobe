// var log = new File(app.activeDocument.path + '/log.txt')
// log.open('w')
var function_a = function (items) {
	var index
	var length = items.length
	var item
	for (index = 0; index < length; index += 1) {
		item = items[index].pathItems
		items[index] = function_b(item)
	}
	return items
}
var function_b = function (items) {
	var index
	var length = items.length
	var item
	var points = []
	var minimum = {
		x: Infinity,
		y: Infinity,
	}
	var point = {
		x: 0,
		y: 0,
		z: 0,
	}
	for (index = 0; index < length; index += 1) {
		item = items[index].pathPoints
		item = function_c(item)
		item.mode = items[index].polarity == PolarityValues.POSITIVE
		points.push(item)
		if (item.x < minimum.x) {
			minimum.x = item.x
		}
		if (item.y < minimum.y) {
			minimum.y = item.y
		}
	}
	for (index = 0; index < length; index += 1) {
		item = points[index]
		// log.writeln(item.x)
		// log.writeln(item.y)
		// log.writeln(item.z)
		item.x -= minimum.x
		item.y -= minimum.y
		item.x *= item.z
		item.y *= item.z
		if (item.mode) {
			point.x += item.x
			point.y += item.y
			point.z += item.z
		} else {
			point.x -= item.x
			point.y -= item.y
			point.z -= item.z
		}
	}
	point.x /= point.z
	point.y /= point.z
	point.x += minimum.x
	point.y += minimum.y
	return point
}
var function_c = function (items) {
	var index
	var length = items.length
	var item
	var points = []
	var pair
	var area
	for (index = 0; index < length; index += 1) {
		item = items[index]
		points.push({
			x: item.anchor[0],
			y: item.anchor[1],
		})
	}
	points.push(points[0])
	item = {
		x: 0,
		y: 0,
		z: 0,
	}
	for (index = 0; index < length; index += 1) {
		pair = {
			a: points[index],
			b: points[index + 1],
		}
		area = pair.a.x * pair.b.y - pair.b.x * pair.a.y
		item.x += (pair.a.x + pair.b.x) * area
		item.y += (pair.a.y + pair.b.y) * area
		item.z += area
	}
	item.x /= 3 * item.z
	item.y /= 3 * item.z
	item.z = Math.abs(item.z / 2)
	return item
}
var active = app.activeDocument
var items = active.selection
var index
var length = items.length
var item
var layer
var radius
items = function_a(items)
for (index = 0; index < length; index += 1) {
	item = items[index]
	layer = active.layers.add()
	// items.move(layer, ElementPlacement.INSIDE)
	radius = Math.sqrt(item.z) * 2 / Math.PI
	// radius = Math.sqrt(item.z) * (Math.sqrt(5) + 1) / Math.PI // gold
	// radius = Math.sqrt(item.z) * 4 / Math.PI // double
	// radius = Math.sqrt(item.z) * (Math.sqrt(5) + 3) / Math.PI // platinum
	layer.pathItems.ellipse(item.y + radius, item.x - radius, radius * 2, radius * 2)
	layer.selected = true
}
