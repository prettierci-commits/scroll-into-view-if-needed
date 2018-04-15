import { Component } from 'react'
import systemFontStack from 'system-font-stack'
import styled, { injectGlobal } from 'styled-components'
import Section from '../components/Section'
import Footer from '../components/Footer'
import List from '../components/List'
import { Text as TextIcon, Chrome } from '../components/Icons'

//import scrollIntoViewIfNeeded from 'scroll-into-view-if-needed'

injectGlobal`
  html,
  body {
    margin: 0;
    padding: 0;
  }
  body {
    font-family: ${systemFontStack};
  }
`

export interface IndexPageProps {
  items: number[]
}

const Hero = styled.header`
  display: flex;
  box-sizing: border-box;
  padding: 0 20px;
  align-items: center;
  justify-content: center;
  background-image: linear-gradient(168deg, #b3fbf7 0%, #ff0561 100%);
  height: 100vh;
`
const Wrapper = styled.div`
  position: relative;
  max-height: 389px;

  svg {
    max-width: 100%;
    height: auto;
  }

  > svg {
    z-index: 1;
    position: relative;
  }
`
const ScrollWrapper = styled.div`
  position: absolute;
  overflow: scroll;
  top: 0;
  left: 0;
  right: 0;
  bottom: 3px;
  opacity: 0.6;

  @supports (mix-blend-mode: overlay) {
    opacity: 1;
    mix-blend-mode: overlay;
  }
`

/*

Show 3 boxes up top

Examples:
* simple 9 x 9 grid that showcases the "if-needed" mode, by making "5" never scroll
* showcase the "center" mode compared to normal scrollIntoView
* and show the "smooth" behavior mode



* normal counter grid
  simple version that do not animate
  or ios like contacts list
* color parallax grid
  introduce animation
* metro grid
* calendar, clicking on a month scrolls the month into view (based on what-she-said) 
* slack like "jump to message"?

*/

const IntroductionSection = styled(Section)`
  margin-top: 10px;
`

export default class IndexPage extends Component<IndexPageProps> {
  static defaultProps = {
    items: Array.apply(null, { length: 100 }).map(Number.call, Number),
  }

  scrollToRef = null

  componentDidMount() {
    setTimeout(() => {
      //scrollIntoViewIfNeeded(document.getElementById('IF-NEEDED'), {})
      ///*
      this.scrollToRef.scrollIntoView({ behavior: 'smooth', block: 'end' })
      //*/
    }, 100)
  }

  render() {
    return (
      <div>
        <Hero>
          <Wrapper>
            <Chrome />
            <ScrollWrapper>
              <TextIcon innerRef={node => (this.scrollToRef = node)} />
            </ScrollWrapper>
          </Wrapper>
        </Hero>
        <IntroductionSection className="columns">
          <div className="column">
            <h2 className="is-size-4">Ponyfill</h2>
            <p>
              This package <a href="http://ponyfill.com/">ponyfills</a>
              &nbsp;new features in the&nbsp;
              <a href="https://developer.mozilla.org/en-US/docs/Web/API/Element/scrollIntoView">
                Element.scrollIntoView
              </a>{' '}
              API. Including features in the non-standard{' '}
              <a href="https://developer.mozilla.org/en-US/docs/Web/API/Element/scrollIntoViewIfNeeded">
                Element.scrollIntoViewIfNeeded
              </a>{' '}
              API, that the CSS working group is{' '}
              <a href="https://github.com/w3c/csswg-drafts/pull/1805">
                proposing
              </a>{' '}
              to add to <code>scrollIntoVIew</code> as another option:{' '}
              <code>scrollMode: "if-needed"</code>.
            </p>
          </div>
          <div className="column">
            <h2 className="is-size-4">Minimal</h2>
            <p>
              To keep the filesize as small as possible only the absolute
              essentials is included by default. Using{' '}
              <code>behavior: "smooth"</code> thus only works in browsers that
              implement it, unless you opt-in to polyfilling it by importing
              from <code>scroll-into-view-if-needed/smooth</code>.
            </p>
          </div>
          <div className="column">
            <h2 className="is-size-4">Customizable</h2>
            <p>
              The available options cover most use cases, but for advanced users
              it's posible to pass in a function to <code>scrollMode</code> to
              control the logic of when to scroll or not, and{' '}
              <code>behavior</code> to if you only need to know if and what to
              scroll but bring your own logic for the actual scrolling.
            </p>
          </div>
        </IntroductionSection>
        <Section>
          <List id={1} items={this.props.items} options={{ duration: 300 }} />
          <List
            boundary
            id={2}
            items={this.props.items}
            options={{ centerIfNeeded: true, duration: 300 }}
          />
          <List
            id={3}
            items={this.props.items}
            options={{
              offset: {
                top: -3,
                right: 9,
                bottom: 9,
                left: -3,
              },
            }}
          />
          <List id={4} items={this.props.items} />
        </Section>
        <Footer />
      </div>
    )
  }
}
