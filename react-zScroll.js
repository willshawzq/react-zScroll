class ZScroll extends React.Component {
	constructor(props) {
	    super(props);
	    this.state = {
	    	height: this.props.height,
	    	step: this.props.step,
	    	showBar: undefined,
	    	distance: 0,
	    	gap: 0
	    };
	}
	componentDidMount() {
		let oUl = this.refs.ul;
		for(let i = 0; i < 20; i++) {
			let oLi = document.createElement("li");
			oLi.innerHTML = i;
			oUl.appendChild(oLi);
		}
		this.setScrollBar();
		this.handleResise();
	}
	setScrollBar() {
		let {zScroll, container, bar, handler} = this.refs,
			sHeight = zScroll.offsetHeight,
			cHeight = container.offsetHeight,
			scale = sHeight / cHeight;
		if(sHeight >= cHeight) {
			this.setState({
				showBar: false,
				distance: 0,
	    		gap: 0
			});
		}else {
			this.setState({
				showBar: true,
				handlerHeight: sHeight * scale + "px"
			});
		}
	}
	handleResise() {
		window.onresize = ev => {
			this.setScrollBar();
		}
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
			maxGap: maxGap,
			scale: cHeight / bHeight
		});
		document.onselectstart=function(ev){
			ev.preventDefault();
			return false;
		};
	}
	handleMouseMove({cHeight, bHeight, topBase, maxGap, scale}) {
		document.onmousemove = (ev) => {
			let gap = ev.clientY - topBase;

			if(gap < 0) {
				gap = 0;
			}else if(gap > maxGap) {
				gap = maxGap;
			}
			this.setState({
				gap: gap,
				distance: gap * scale
			});

			document.onmouseup = (ev) => {
				document.onmousemove = document.onmouseup = document.onselectstart = null;
			}
		}
	}
	componentDidUpdate() {
		this.handleScroll();
	}
	handleScroll() {
		let {zScroll} = this.refs;
		this.removeWheelEvent(zScroll, this.fn);
		if(!this.state.showBar) {
			return;
		}
		let {
				bar, 
				handler, 
				container, 
				step
			} = this.refs;
		let oHeight = zScroll.offsetHeight,
			hHeight = handler.offsetHeight,
			bHeight = bar.offsetHeight,
			cHeight = container.offsetHeight,
			barMaxGap = bHeight - hHeight,
			conMaxGap = cHeight - oHeight,
			barStep = step,
			conStep = conMaxGap * barStep / barMaxGap;
		this.fn = this.wheelFn.bind(this, {
			barStep, conStep, barMaxGap, conMaxGap
		})
		this.addWheelEvent(zScroll, this.fn);
	}
	wheelFn({
		barStep, conStep, barMaxGap, conMaxGap
	}, ev) {
		let {gap, distance, height} = this.state,
            delta = (ev.wheelDelta) ? ev.wheelDelta / 120 : -(ev.detail || 0) / 3;
		if(delta >= 0) {
			this.setState({
				gap: gap > barStep ? (gap - barStep) : 0,
				distance: distance > conStep ? (distance - conStep) : 0
			});
		}else {
			this.setState({
				gap: (gap + barStep < barMaxGap) ? (gap + barStep) : barMaxGap,
				distance: (distance + conStep < conMaxGap) ? (distance + conStep) : conMaxGap
			});
		}
	}
	removeWheelEvent(el, fn) {
		let type = document.mozHidden !== undefined ? 'DOMMouseScroll' : 'mousewheel';
		el.removeEventListener(type, fn, false);
	}
	addWheelEvent(el, fn) {
		let type = document.mozHidden !== undefined ? 'DOMMouseScroll' : 'mousewheel';
		el.addEventListener(type, fn, false);
	}
	render() {
		let {height, gap, distance, showBar, handlerHeight} = this.state;
		let sStyle = {
				height: height
			},
			cStyle = {
				transform: `translate3d(0,-${distance}px,0)`
			},
			hStyle = {
				height: handlerHeight,
				transform: `translate3d(0,${gap}px,0)`
			}
		return (
			<div className="ZScroll" ref="zScroll" style={sStyle}>
				<div className="scroll-container" ref="container" style={cStyle}>
					<ul ref="ul"></ul>
				</div>
				{(()=>{
					if(showBar) {
						return (
								<div className="scroll-bar" ref="bar">
									<span className="handler" ref="handler" style={hStyle}
										onMouseDown={this.handleMouseDown.bind(this)}></span>
								</div>
							);
					}
				})()}
				
			</div>
		);
	}
}
ZScroll.defaultProps = {
	height: '80%',
	step: 40
}
ZScroll.propTypes = {
	height: React.PropTypes.string.isRequired,
	height: React.PropTypes.string
}
