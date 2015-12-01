class VScroll extends React.Component {
	constructor(props) {
	    super(props);
	    this.state = {
	    	height: this.props.maxHeight,
	    	distance: 0,
	    	gap: 0
	    };
	}
	componentDidMount() {
		let oUl = this.refs.ul;
		for(let i = 0; i < 100; i++) {
			let oLi = document.createElement("li");
			oLi.innerHTML = i;
			oUl.appendChild(oLi);
		}
		this.setScrollBar();
	}
	setScrollBar() {
		let {vScroll, container, bar, handler} = this.refs,
			sHeight = vScroll.offsetHeight,
			cHeight = container.offsetHeight,
			scale = sHeight / cHeight;
		handler.style.height = sHeight * scale + "px";
	}
	handleMouseDown(ev) {
		let {
				container, 
				bar, 
				handler
			} = this.refs,
			{
				distance,
				gap
			} = this.state,
			cHeight = container.offsetHeight,
			bHeight = bar.offsetHeight,
			//after translate,the el offsetTop still zero
			hOffsetTop = handler.getBoundingClientRect().top,
			topBase = ev.clientY - hOffsetTop,
			maxGap = bHeight - handler.offsetHeight;
			
		this.handleMouseMove.call(this, {
			cHeight: cHeight,
			bHeight: bHeight,
			topBase: topBase,
			maxGap: maxGap
		});
		document.onselectstart=function(ev){
			ev.preventDefault();
			return false;
		};
	}
	handleMouseMove({cHeight, bHeight, topBase, maxGap}) {
		document.onmousemove = (ev) => {
			let gap = ev.clientY - topBase;

			if(gap < 0) {
				gap = 0;
			}else if(gap > maxGap) {
				gap = maxGap;
			}
			this.setState({
				gap: gap,
				distance: gap / bHeight * cHeight
			});

			document.onmouseup = (ev) => {
				document.onmousemove = document.onmouseup = document.onselectstart = null;
			}
		}
		
	}
	render() {
		let {height, gap, distance} = this.state;
		let sStyle = {
				height: height
			},
			cStyle = {
				transform: `translate3d(0,-${distance}px,0)`
			},
			hStyle = {
				transform: `translate3d(0,${gap}px,0)`
			}
		return (
			<div className="VScroll" ref="vScroll" style={sStyle}>
				<div className="scroll-container" ref="container" style={cStyle}>
					<ul ref="ul"></ul>
				</div>
				<div className="scroll-bar" ref="bar">
					<span className="handler" ref="handler" style={hStyle}
						onMouseDown={this.handleMouseDown.bind(this)}></span>
				</div>
			</div>
		);
	}
}
VScroll.defaultProps = {
	maxHeight: '400px'
}
VScroll.propTypes = {
	maxHeight: React.PropTypes.string.isRequired
}
