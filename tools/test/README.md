[dibeneditto.com](https://dibeneditto.com/) ⇒ [tools](/tools/) ⇒ test ⇒ README.md


[[raw]](https://raw.githubusercontent.com/dibeneditto/dibeneditto.github.io/master/tools/test/README.md) [[edit]](https://github.com/dibeneditto/dibeneditto.github.io/edit/master/tools/test/README.md)

<table>
    <tr><th>Country</th><th>Date</th><th>Size</th></tr>
    <tr><td>France</td><td>2001-01-01</td><td><i>25</i></td></tr>
    <tr><td><a href=#>spain</a></td><td><i>2005-05-05</i></td><td></td></tr>
    <tr><td><b>Lebanon</b></td><td><a href=#>2002-02-02</a></td><td><b>-17</b></td></tr>
    <tr><td><i>Argentina</i></td><td>2005-04-04</td><td><a href=#>100</a></td></tr>
    <tr><td>USA</td><td></td><td>-6</td></tr>
</table>



```json:table
{
    "fields" : [
        {"key": "a", "label": "AA", "sortable": true},
        {"key": "b", "label": "BB"},
        {"key": "c", "label": "CC"}
    ],
    "items" : [
      {"a": "11", "b": "22", "c": "33"},
      {"a": "211", "b": "222", "c": "233"}
    ]
}
```


Image under:
<svg width="16" height="16"><rect width="16" height="16" style="fill:#FE5255;" /></svg>

Image inline <svg width="16" height="16"><rect width="16" height="16" style="fill:#FE5255;" /></svg> more text


* #FE5255 <svg width="16" height="16"><rect width="16" height="16" style="fill:#FE5255;" /></svg> **RED** Important
* #FFBB31 <svg width="16" height="16"><rect width="16" height="16" style="fill:#FFBB31;" /></svg> **YELLOW** Interesting
* #22C75D <svg width="16" height="16"><rect width="16" height="16" style="fill:#22C75D;" /></svg> **GREEN** Definition Term
* #00B1FB <svg width="16" height="16"><rect width="16" height="16" style="fill:#00B1FB;" /></svg> **BLUE** Definition
* #D11BF3 <svg width="16" height="16"><rect width="16" height="16" style="fill:#D11BF3;" /></svg> **PURPLE** Unknown Word
* #8D6E64 <svg width="16" height="16"><rect width="16" height="16" style="fill:#8D6E64;" /></svg> **BROWN** Special Use


| | Color | Meaning | HTML Color |
| :-: | :-: | :-: | :-: |
| <svg width="16" height="16"><rect width="16" height="16" style="fill:#FE5255;" /></svg> | RED | Important | #FE5255 |
| <svg width="16" height="16"><rect width="16" height="16" style="fill:#FFBB31;" /></svg> | YELLOW | Interesting | #FFBB31 |
| <svg width="16" height="16"><rect width="16" height="16" style="fill:#22C75D;" /></svg> | GREEN | Definition Term | #22C75D |
| <svg width="16" height="16"><rect width="16" height="16" style="fill:#00B1FB;" /></svg> | BLUE | Definition | #00B1FB |
| <svg width="16" height="16"><rect width="16" height="16" style="fill:#D11BF3;" /></svg> | PURPLE | Unknown Word | #D11BF3 |
| <svg width="16" height="16"><rect width="16" height="16" style="fill:#8D6E64;" /></svg> | BROWN | Special Use | #8D6E64 |




# h1_title of page

h1_text Note: Three \n after sections. Two \n after \[\[top\]\]\(\#\).

[Link](http://example.com) or [Reference 1][1] or [Reference 2][2]

[[top]](#)



## h2_section of page

h2_text

Link tests:

* [template](#)

* [vertical bar |](#)

* [left square bracket [](#)

* [right square bracket ]](#)

* [number sign #](#)

[[top]](#)



### h3_sub_section of page

h3_text

[[top]](#)


### h3_sub_section of page

h3_text

  text with two spaces

    text with four spaces text with four spaces text with four spaces text with four spaces text with four spaces text with four spaces text with four spaces text with four spaces text with four spaces text with four spaces text with four spaces text with four spaces text with four spaces text with four spaces text with four spaces text with four spaces text with four spaces text with four spaces text with four spaces

[[top]](#)


## See also:

* [title](https://example.com/)


## References

[1]: http://example.com "example 1"
[2]: http://example.net



Headers
---------------------------

# Header 1

## Header 2

### Header 3



Styling
---------------------------

*Emphasize* _emphasize_

**Strong** __strong__

==Marked text.==

~~Mistaken text.~~

> Quoted text.

H~2~O is a liquid.

2^10^ is 1024.



Lists
---------------------------

- Item
  * Item
    + Item

1. Item 1
2. Item 2
3. Item 3

- [ ] Incomplete item
- [x] Complete item



Links
---------------------------

A [link](http://example.com).

An image: ![Alt](img.jpg)

A sized image: ![Alt](img.jpg =60x50)



Code
---------------------------

Some `inline code`.

```
// A code block
var foo = 'bar';
```

```javascript
// An highlighted block
var foo = 'bar';
```



Tables
---------------------------

Item     | Value
-------- | -----
Computer | $1600
Phone    | $12
Pipe     | $1


| Column 1 | Column 2      |
|:--------:| -------------:|
| centered | right-aligned |



Definition lists
---------------------------

Markdown
:  Text-to-HTML conversion tool

Authors
:  John
:  Luke



Footnotes
---------------------------

Some text with a footnote.[^1]

[^1]: The footnote.



Abbreviations
---------------------------

Markdown converts text to HTML.

*[HTML]: HyperText Markup Language



LaTeX math
---------------------------

Note that this assumes the following delimiters appear in your HTML:

$$\LaTeX code$$   (for display)
\\[\LaTeX code\\] (also for display)
\\(\LaTeX code\\) (for inline)

The Gamma function satisfying $\Gamma(n) = (n-1)!\quad\forall n\in\mathbb N$ is via the Euler integral

$$ c = \pm\sqrt{a^2 + b^2} $$

$$
\Gamma(z) = \int_0^\infty t^{z-1}e^{-t}dt\,.
$$


This math is inline: $`a^2+b^2=c^2`$.
This math is inline: $$`a^2+b^2=c^2`$$.
This math is inline: \\(`a^2+b^2=c^2`$\\).

This math is on a separate line:

```math
a^2+b^2=c^2
```

<a href="https://render.githubusercontent.com/render/math?math=e^{i \pi} = -1">`https://render.githubusercontent.com/render/math?math=e^{i \pi} = -1`</a>




&nbsp;

---

© Lukas W. DiBeneditto, [dibeneditto.com](https://dibeneditto.com/)

[[top]](#)



<script defer>

// This function takes a table row (tr) and an index (idx) as arguments,
// and returns the inner text or text content of the cell at the specified index in the row.
function getCellValue(tr, idx) {
    return tr.children[idx].innerText || tr.children[idx].textContent;
}

// This function takes an index (idx) and a boolean value (asc) as arguments,
// and returns a function that compares two rows (a and b) based on the values in the cell
// at the specified index. If asc is true, the rows will be sorted in ascending order.
// If asc is false, the rows will be sorted in descending order.
function comparer(idx, asc) {
    return (a, b) => {
        // Get the values of the cells to be compared
        const v1 = getCellValue(asc ? a : b, idx);
        const v2 = getCellValue(asc ? b : a, idx);
        // Compare the values
        if (v1 !== '' && v2 !== '' && !isNaN(v1) && !isNaN(v2)) {
            // If the values are not empty and are numbers, compare them as numbers
            return v1 - v2;
        }
        // If the values are not numbers, compare them as strings
        return v1.toString().localeCompare(v2);
    };
}

// Add an event listener to each table header (th) element
document.querySelectorAll('th').forEach((th) => {
    // add cursor pointer to all th elements
    th.style.cursor = "pointer";
    
    th.addEventListener('click', (() => {
        // When a header is clicked, sort the rows in the table based on the values in the column
        // corresponding to the clicked header
        const table = th.closest('table');
        Array.from(table.querySelectorAll('tr:nth-child(n+2)'))
            .sort(comparer(Array.from(th.parentNode.children).indexOf(th), this.asc = !this.asc))
            .forEach((tr) => table.appendChild(tr));
    }));
});

</script>
